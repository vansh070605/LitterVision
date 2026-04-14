from flask import Flask, render_template, request, send_from_directory, redirect, url_for, jsonify
from flask_cors import CORS
import os
from datetime import datetime

# Force CPU-only TensorFlow
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
import torch
import time
import io
import base64
import uuid
import socket

app = Flask(__name__)
CORS(app)

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

mobile_sessions = {}

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

# Lazy-loaded model
model = None


def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model(
            "models/best_model_finetuned.h5",
            custom_objects={'BatchNormalization': CustomBN},
            compile=False
        )
    return model

generator = None
def get_generator():
    global generator
    if generator is None:
        try:
            generator = torch.jit.load("models/generator_scripted.pt").eval()
        except:
            pass
    return generator


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
    start_time = time.time()
    img = preprocess_image(image_path)
    m = get_model()
    preds = m.predict(img)[0]
    latency = round((time.time() - start_time) * 1000, 2)

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
        latency=latency
    )

@app.route("/api/analyze", methods=["POST"])
def api_analyze():
    file = request.files.get("image")
    if not file or not file.filename:
        return jsonify({"error": "No image file provided."}), 400

    safe_filename = file.filename.replace(" ", "_")
    image_path = os.path.join(app.config["UPLOAD_FOLDER"], safe_filename)
    file.save(image_path)

    start_time = time.time()
    img = preprocess_image(image_path)
    m = get_model()
    preds = m.predict(img)[0]
    latency = round((time.time() - start_time) * 1000, 2)

    top_indices = preds.argsort()[-3:][::-1]
    top_predictions = [
        [classes[i], round(float(preds[i]) * 100, 2)]
        for i in top_indices
    ]

    prediction = top_predictions[0][0]
    confidence = top_predictions[0][1]
    tip_str = tips.get(prediction, "")

    if confidence <= 30:
        cleanliness = "🟢 Clean Area"
    elif confidence <= 70:
        cleanliness = "🟡 Moderately Polluted"
    else:
        cleanliness = "🔴 Highly Polluted"

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "latency": latency,
        "cleanliness": cleanliness,
        "top_predictions": top_predictions,
        "tip": tip_str,
        "image_url": f"/static/uploads/{safe_filename}"
    })

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

@app.route("/health")
def health():
    try:
        m = get_model()
    except Exception as e:
        print("Model load error:", e)
        m = None
        
    try:
        g = get_generator()
    except Exception as e:
        print("Generator load error:", e)
        g = None
        
    return {"status": "ok", "model_loaded": m is not None, "generator_loaded": g is not None}

@app.route("/synthesize", methods=["GET"])
def synthesize():
    gen = get_generator()
    if gen is None:
        return {"error": "Generator model not found"}, 500
    
    with torch.no_grad():
        noise = torch.randn(1, 100, 1, 1)
        fake = gen(noise)[0]
    
    # Process for returning
    fake = (fake.permute(1, 2, 0) + 1) / 2.0
    fake = (fake.numpy() * 255).astype(np.uint8)
    img = Image.fromarray(fake)
    
    img_io = io.BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    
    base64_img = base64.b64encode(img_io.getvalue()).decode('utf-8')
    return {"image": f"data:image/png;base64,{base64_img}"}

@app.route("/api/session/create")
def session_create():
    sid = str(uuid.uuid4())
    mobile_sessions[sid] = {"image": None}
    return jsonify({"sessionId": sid, "ip": get_local_ip()})

@app.route("/api/session/<sid>/upload", methods=["POST"])
def session_upload(sid):
    if sid not in mobile_sessions:
        return jsonify({"error": "Invalid session"}), 404
    file = request.files.get("image")
    if file:
        safe_filename = sid + "_" + file.filename.replace(" ", "_")
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], safe_filename)
        file.save(image_path)
        mobile_sessions[sid]["image"] = f"http://{get_local_ip()}:5000/static/uploads/{safe_filename}"
        return jsonify({"success": True})
    return jsonify({"error": "No file"}), 400

@app.route("/api/session/<sid>/poll")
def session_poll(sid):
    if sid not in mobile_sessions:
        return jsonify({"error": "Invalid session"}), 404
    if mobile_sessions[sid]["image"]:
        return jsonify({"has_image": True, "image_url": mobile_sessions[sid]["image"]})
    return jsonify({"has_image": False})

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
