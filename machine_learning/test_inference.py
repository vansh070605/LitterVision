"""
LitterVision - OOD Fix Validation Script
=========================================
Tests the updated smart_preprocess_image() pipeline against the watch images
that were previously misclassified as 'Cardboard' with 95%+ confidence.

Run from the project root:
    python machine_learning/test_inference.py
"""

import os, sys, time, json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import numpy as np
import cv2
from PIL import Image
import tensorflow as tf


# ── Reproduce the exact same CustomBN shim used in production ─────────────────
class CustomBN(tf.keras.layers.BatchNormalization):
    def __init__(self, **kwargs):
        kwargs.pop('renorm', None)
        kwargs.pop('renorm_clipping', None)
        kwargs.pop('renorm_momentum', None)
        super().__init__(**kwargs)


CLASSES       = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
OOD_THRESHOLD = 0.75
MODEL_PATH    = os.path.join(os.path.dirname(__file__),
                             '..', 'backend', 'models', 'best_model_finetuned.h5')

TEST_IMAGES = [
    os.path.join(os.path.dirname(__file__), 'test_images', 'watch.jpeg'),
    os.path.join(os.path.dirname(__file__), 'test_images', 'watch_2.jpeg'),
    # legitimate waste images for sanity-check
    os.path.join(os.path.dirname(__file__), 'test_images', 'cardboard_testing.jpg'),
    os.path.join(os.path.dirname(__file__), 'test_images', 'metal_testing.jpg'),
    os.path.join(os.path.dirname(__file__), 'test_images', 'glass_testing.jpg'),
]


# ── Preprocessing (mirrors backend/app.py exactly) ────────────────────────────
def smart_preprocess_image(img_path):
    pil_img = Image.open(img_path).convert("RGB")
    cv_img  = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    h, w    = cv_img.shape[:2]

    gray      = cv2.cvtColor(cv_img, cv2.COLOR_BGR2GRAY)
    blurred   = cv2.GaussianBlur(gray, (15, 15), 0)
    _, thresh = cv2.threshold(blurred, 0, 255,
                              cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL,
                                   cv2.CHAIN_APPROX_SIMPLE)

    MIN_AREA_RATIO = 0.10
    PADDING        = 20
    crop_done      = False
    crop_info      = "fallback centre-crop"

    if contours:
        largest = max(contours, key=cv2.contourArea)
        ratio   = cv2.contourArea(largest) / (h * w)
        if ratio >= MIN_AREA_RATIO:
            x, y, bw, bh = cv2.boundingRect(largest)
            x1 = max(0, x - PADDING);  y1 = max(0, y - PADDING)
            x2 = min(w, x + bw + PADDING); y2 = min(h, y + bh + PADDING)
            cv_img    = cv_img[y1:y2, x1:x2]
            crop_done = True
            crop_info = f"contour crop ({x1},{y1})-({x2},{y2}), area_ratio={ratio:.2%}"

    if not crop_done:
        mh = int(h * 0.20); mw = int(w * 0.20)
        cv_img = cv_img[mh:h - mh, mw:w - mw]

    resized = cv2.resize(cv_img, (224, 224))
    rgb     = cv2.cvtColor(resized, cv2.COLOR_BGR2RGB)
    arr     = np.array(rgb, dtype=np.float32)
    arr     /= 255.0
    arr     = np.expand_dims(arr, axis=0)
    return arr, crop_info


# ── Load model ────────────────────────────────────────────────────────────────
print("Loading model …")
t0    = time.time()
model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={'BatchNormalization': CustomBN},
    compile=False
)
print(f"Model loaded in {time.time()-t0:.1f}s\n")


# ── Run inference ─────────────────────────────────────────────────────────────
results = []

for img_path in TEST_IMAGES:
    if not os.path.exists(img_path):
        print(f"[SKIP] {img_path} not found")
        continue

    name = os.path.basename(img_path)
    t1   = time.time()
    arr, crop_info = smart_preprocess_image(img_path)
    preds          = model.predict(arr, verbose=0)[0]
    latency        = round((time.time() - t1) * 1000, 1)

    top_conf_raw = float(np.max(preds))
    is_ood       = top_conf_raw < OOD_THRESHOLD
    verdict      = "UNKNOWN / OOD" if is_ood else f"{CLASSES[int(np.argmax(preds))].upper()}"

    dist = {cls: round(float(p) * 100, 2) for cls, p in zip(CLASSES, preds)}
    dist_sorted = dict(sorted(dist.items(), key=lambda x: -x[1]))

    results.append({
        "image":     name,
        "crop":      crop_info,
        "verdict":   verdict,
        "is_ood":    is_ood,
        "top_conf":  round(top_conf_raw * 100, 2),
        "latency_ms": latency,
        "distribution": dist_sorted,
    })

    # Pretty-print to console
    bar = lambda p: "#" * int(p / 5) + "." * (20 - int(p / 5))
    print(f"{'='*60}")
    print(f"Image   : {name}")
    print(f"Crop    : {crop_info}")
    print(f"Verdict : {verdict}  (top conf: {top_conf_raw*100:.2f}%)")
    print(f"Latency : {latency} ms")
    print(f"Threshold: {OOD_THRESHOLD*100:.0f}%")
    print(f"\nConfidence Distribution:")
    for cls, pct in dist_sorted.items():
        print(f"  {cls:12s} {bar(pct)} {pct:6.2f}%")
    print()


# ── Write JSON for artifact ───────────────────────────────────────────────────
out_path = os.path.join(os.path.dirname(__file__), 'inference_test_results.json')
with open(out_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"\nResults saved -> {out_path}")
