from flask import Flask, render_template, request, send_from_directory
import os

# Force CPU-only TensorFlow (IMPORTANT for Render)
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)

UPLOAD_FOLDER = "static/uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Lazy-loaded model
model = None

def get_model():
    global model
    if model is None:
        model = tf.keras.models.load_model("model.h5")
    return model


classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']

tips = {
    "paper": "♻️ Paper can be recycled or composted if clean.",
    "plastic": "🚯 Avoid single-use plastic. Recycle if possible.",
    "metal": "🔩 Metal has high recycling value. Please recycle.",
    "glass": "🍾 Glass is 100% recyclable. Handle carefully.",
    "cardboard": "📦 Flatten cardboard before recycling.",
    "trash": "🗑️ Dispose properly to reduce landfill impact."
}

def preprocess_image(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route("/", methods=["GET", "POST"])
def index():
    prediction = None
    confidence = None
    image_path = None
    top_predictions = None
    tip = None
    cleanliness = None

    if request.method == "POST":
        file = request.files.get("image")
        if file:
            image_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
            file.save(image_path)

            img = preprocess_image(image_path)

            model = get_model()   # ✅ IMPORTANT FIX
            preds = model.predict(img)[0]

            top_indices = preds.argsort()[-3:][::-1]
            top_predictions = [
                (classes[i], round(float(preds[i]) * 100, 2))
                for i in top_indices
            ]

            prediction = top_predictions[0][0]
            confidence = top_predictions[0][1]
            tip = tips.get(prediction, "")

            # Cleanliness score
            if confidence <= 30:
                cleanliness = "🟢 Clean Area"
            elif confidence <= 70:
                cleanliness = "🟡 Moderately Polluted"
            else:
                cleanliness = "🔴 Highly Polluted"

    return render_template(
        "index.html",
        prediction=prediction,
        confidence=confidence,
        image_path=image_path,
        top_predictions=top_predictions,
        tip=tip,
        cleanliness=cleanliness
    )


# Optional: clean favicon 404s
@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static/uploads/favicon_io"),
        "favicon.ico",
        mimetype="image/vnd.microsoft.icon"
    )


if __name__ == "__main__":
    app.run()
