from flask import Flask, render_template, request, send_from_directory, redirect, url_for
import os
from datetime import datetime

# Force CPU-only TensorFlow
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB limit
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


class CustomBN(tf.keras.layers.BatchNormalization):
    def __init__(self, **kwargs):
        kwargs.pop('renorm', None)
        kwargs.pop('renorm_clipping', None)
        kwargs.pop('renorm_momentum', None)
        super().__init__(**kwargs)


# Lazy-loaded model
model = None


def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(
            "best_model_finetuned.h5",
            custom_objects={'BatchNormalization': CustomBN},
            compile=False
        )
    return model


classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

tips = {
    "paper":     "♻️ Paper can be recycled or composted if clean. Ensure it's dry before placing in the recycling bin.",
    "plastic":   "🚯 Avoid single-use plastic. Recycle if possible — check the resin code on the bottom.",
    "metal":     "🔩 Metal has high recycling value. Rinse cans before recycling to prevent contamination.",
    "glass":     "🍾 Glass is 100% recyclable and infinitely recyclable without quality loss. Handle carefully.",
    "cardboard": "📦 Flatten cardboard before recycling to save space and speed up processing.",
    "trash":     "🗑️ Dispose properly in sealed bags to reduce landfill methane and prevent wildlife harm."
}


def preprocess_image(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    return img


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/analyze", methods=["GET", "POST"])
def analyze():
    if request.method == "GET":
        return render_template("analyze.html")

    # POST: run inference
    file = request.files.get("image")
    if not file or not file.filename:
        return render_template("analyze.html", error="No image file provided.")

    # Save upload
    safe_filename = file.filename.replace(" ", "_")
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], safe_filename)
    file.save(image_path)

    # Inference
    img = preprocess_image(image_path)
    m = get_model()
    preds = m.predict(img)[0]

    top_indices = preds.argsort()[-3:][::-1]
    top_predictions = [
        (classes[i], round(float(preds[i]) * 100, 2))
        for i in top_indices
    ]

    prediction = top_predictions[0][0]
    confidence = top_predictions[0][1]
    tip = tips.get(prediction, "")

    # Cleanliness severity
    if confidence <= 30:
        cleanliness = "🟢 Clean Area"
    elif confidence <= 70:
        cleanliness = "🟡 Moderately Polluted"
    else:
        cleanliness = "🔴 Highly Polluted"

    now = datetime.now().strftime("%Y.%m.%d.%H.%M.%S")

    return render_template(
        "results.html",
        prediction=prediction,
        confidence=confidence,
        image_path=image_path,
        top_predictions=top_predictions,
        tip=tip,
        cleanliness=cleanliness,
        now=now,
    )


@app.route("/impact")
def impact():
    return render_template("impact.html")


# Serve uploaded images
@app.route("/static/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# Favicon
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static/uploads/favicon_io"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon"
    )


if __name__ == "__main__":
    app.run(debug=True)
