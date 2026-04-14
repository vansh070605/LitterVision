# LitterVision AI 🌍♻️

**LitterVision AI** is an edge-ready, machine-learning-powered visual intelligence framework designed to automate and optimize the classification of municipal solid waste. By leveraging modern Deep Learning, LitterVision aims to solve the critical "last-mile" sorting problem in global recycling infrastructures.

## 🔬 The Research Problem
Global urban centers generate millions of tons of solid waste annually, with a vast majority ending up in landfills due to inefficient separation. Traditional recycling pipelines rely heavily on manual sorting or rudimentary optical scanners, which struggle with severe contamination, edge-cases, and class imbalances (e.g., distinguishing a crushed soda can from metallic debris). 

We engineered LitterVision as a research-grade remedy to optical failure points. By combining a highly efficient discriminative classifier with algorithmic generative augmentation, we ensure the framework can operate accurately in real-world, unpredictable spatial environments without getting biased by common waste topologies.

---

## 🧠 Neural Architecture & Methodology

LitterVision is powered by a dual-network strategy:

### 1. MobileNetV2 (Visual Classifier)
Our core detection engine evaluates incoming image tensors in real-time. 
*   **Why MobileNetV2?:** We chose the MobileNetV2 architecture (often fine-tuned to behave like progressive networks like EfficientNet) over heavier models (like ResNet50 or YOLOv8) due to its optimal parameter-to-accuracy ratio. It maintains sub-150ms inference latencies on CPU targets, ensuring the platform is lightweight enough for actual edge deployments on embedded IoT devices.
*   **Output:** The model utilizes a softmax layer strictly calibrated across 6 municipal waste subsets: `Cardboard`, `Glass`, `Metal`, `Paper`, `Plastic`, and `Trash`. 

### 2. DCGAN (Generative Synthesis)
*   **Why DCGAN?:** To overcome dataset imbalances. While diffusion models are newer, a Deep Convolutional Generative Adversarial Network (DCGAN) offers a highly efficient map from pure random noise vectors (\(z \in \mathbb{R}^{100}\)) directly to spatial imaging. By algorithmically synthesizing edge cases (like crushed cans), we continuously augment our training tensors.

### 📊 Performance Metrics
Following rigorous evaluation on our split testing datasets, the discriminator achieved robust performance:
*   **Top-1 Accuracy:** ~93.4%
*   **Macro F1-Score:** ~0.91
*   **Inference Latency:** < 180ms (System Dependent)

*(Note: Uploading Out-Of-Distribution (OOD) objects like furniture or electronics will result in mathematically forced misclassifications since the architecture is strictly constrained to the 6 waste parameters).*

---

## 📂 Project Structure

To maintain clean developmental standards, the project has been refactored into a decoupled architecture:

```text
LitterVision/
│
├── frontend/                 # Modern React UI Ecosystem
│   ├── src/                  # Brutalist UI, Components, Pages
│   ├── package.json          # Vite & React Dependencies
│   └── vite.config.js        # Configured for Local IP Proxying
│
├── backend/                  # Flask AI Inference Engine
│   ├── app.py                # Core REST API (Sockets, Waitresses)
│   ├── requirements.txt      # Python Dependencies
│   ├── static/uploads/       # Ephemeral Storage for Transmissions
│   └── models/               # Production Neural Weights (.h5 & .pt)
│
├── machine_learning/         # Research & Training Archive
│   ├── ML Training - 1/      # Primary CNN Classification Notebooks
│   ├── ML Training - 2/      # DCGAN Adversarial Notebooks
│   ├── dataset/              # Raw Image Tensors (Not in use for runtime)
│   ├── research/             # Academic Notes & Papers
│   └── test_images/          # Held-out testing data
│
└── README.md                 # Project Documentation
```

---

## 🚀 Getting Started

LitterVision separates the heavy Neural network initialization from the UI thread. You must start both ends.

### 1. Initialize the AI Inference Engine (Backend)
Open a terminal, activate your virtual environment, and boot the API.
```bash
cd backend
# Windows: ..\.venv\Scripts\Activate.ps1
# Mac/Linux: source ../.venv/bin/activate
python app.py
```
*The server will bind to `0.0.0.0:5000` to allow local-network mobile connections.*

### 2. Launch the Operator Dashboard (Frontend)
Open a **new** terminal window and start the Vite development server.
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` in your browser. 

### 📱 Using the Mobile Link
1.  Navigate to the **Analyze** tab on the desktop dashboard.
2.  Click **Camera**.
3.  Scan the dynamically generated QR Code with your smartphone.
4.  Snap a picture of municipal waste (e.g., plastic bottle, cardboard).
5.  Watch it instantly transmit to your desktop via the Local Area Network WebSocket bridge!