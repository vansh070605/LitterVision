<h1 align="center">
  🚮 LitterVision
</h1>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?size=28&duration=3500&color=00FFD5&center=true&vCenter=true&width=700&lines=AI-Powered+Litter+Classification;Computer+Vision+for+Clean+Cities;Smart+Urban+Cleanliness+Initiative" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Flask-Web%20App-black?style=for-the-badge&logo=flask" />
  <img src="https://img.shields.io/badge/TensorFlow-Deep%20Learning-orange?style=for-the-badge&logo=tensorflow" />
  <img src="https://img.shields.io/badge/Computer%20Vision-AI-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Render-green?style=for-the-badge" />
</p>

---

## 🌍 Live Demo
🔗 **https://litter-vision.onrender.com**

> ⚠️ *Free hosting may take ~30 seconds to wake up (cold start)*

---

## 📌 About the Project

**LitterVision** is an **AI-powered litter detection and classification system** that uses **computer vision and deep learning** to identify different types of waste from real-world images.

The system helps **quantify litter severity** and provides **environmental guidance**, making it suitable for **urban cleanliness and smart city initiatives**.

---

## 🧠 Problem Statement

> Improper waste disposal is a major contributor to urban pollution. Manual monitoring of litter is inefficient and costly.

**Solution:**  
An automated computer vision system that can:
- Detect litter presence
- Classify waste type
- Quantify cleanliness level
- Assist urban cleanliness decision-making

---

## ⚙️ Tech Stack

| Layer | Technology |
|-----|-----------|
Frontend | HTML, CSS (Glassmorphism UI) |
Backend | Flask |
ML Model | MobileNetV2 (Transfer Learning) |
Framework | TensorFlow / Keras |
Deployment | Render (Gunicorn) |

---

## 🧪 Features

✅ Image-based litter classification  
✅ Camera capture support (mobile-friendly)  
✅ Confidence score with animated bar  
✅ Cleanliness severity quantification  
✅ Environmental tips based on litter type  
✅ Modern animated UI  
✅ Deployed with public URL  

---

## 🗂️ Litter Categories

- 🟫 Cardboard  
- 🟦 Glass  
- 🔩 Metal  
- 📄 Paper  
- 🧴 Plastic  
- 🗑️ Trash  

---

## 📊 Cleanliness Quantification Logic

| Confidence Score | Cleanliness Level |
|------------------|------------------|
0–30% | 🟢 Clean Area |
31–70% | 🟡 Moderately Polluted |
71–100% | 🔴 Highly Polluted |

This satisfies **litter quantification** for urban cleanliness analysis.

---

## 📸 Application Flow

```text
User uploads image / uses camera
        ↓
Image preprocessing
        ↓
Deep Learning Model (MobileNetV2)
        ↓
Prediction + Confidence
        ↓
Cleanliness Score + Environmental Tip
````

---

## 🚀 Deployment

The application is deployed on **Render (Free Tier)** using:

```bash
gunicorn app:app --workers 1 --threads 1 --timeout 120
```

Optimized for **low-memory cloud environments** using:

* CPU-only inference
* Lazy model loading

---

## 🧠 Viva / Interview Explanation

> “LitterVision is a computer vision–based system that classifies litter from real-world images and quantifies cleanliness levels using confidence-based severity scoring, supporting urban cleanliness initiatives.”

---

## 📁 Project Structure

```bash
LitterVision/
│
├── app.py
├── train.py
├── model.h5
├── requirements.txt
├── templates/
│   └── index.html
├── static/
│   └── uploads/
│       └── favicon_io/
├── Dataset/
│   ├── cardboard/
│   ├── glass/
│   ├── metal/
│   ├── paper/
│   ├── plastic/
│   └── trash/
└── README.md
```

---

## 🛠️ How to Run Locally

```bash
pip install -r requirements.txt
python app.py
```

Open:

```
http://127.0.0.1:5000
```

---

## 🌱 Future Enhancements

* Bounding-box litter detection (YOLO)
* Prediction history dashboard
* Area-wise cleanliness analytics
* Grad-CAM explainability
* Mobile app integration

---

## 👨‍💻 Author

**Vansh Agrawal**
Engineering Student | AI & ML Enthusiast

🔗 GitHub: [https://github.com/vansh070605](https://github.com/vansh070605)

---

<p align="center">
  ⭐ If you like this project, consider starring the repo!
</p>
```