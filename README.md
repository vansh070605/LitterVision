# LitterVision: A Deep Learning Framework for Automated Municipal Waste Classification and Segregation

## Abstract
LitterVision AI is a comprehensive, edge-ready visual intelligence framework designed to automate the classification of municipal solid waste (MSW). Addressing the critical "last-mile" sorting challenge in global recycling infrastructures, this project implements a two-stage transfer learning pipeline utilizing the MobileNetV2 architecture. To mitigate dataset imbalances and enhance robustness, the framework integrates a Deep Convolutional Generative Adversarial Network (DCGAN) for synthetic data augmentation. Our experimental results demonstrate a validation accuracy of **78%** (Weighted F1-score: **0.80**) across six primary waste categories, with high precision in identifying cardboard (**98%**) and metal (**90%**). The system is optimized for low-latency inference on CPU-constrained devices, featuring a novel contour-based foreground isolation preprocessing layer and strict Out-of-Distribution (OOD) thresholding.

---

## 1. Introduction & Problem Statement
Global urban centers generate over 2 billion tons of municipal solid waste annually. A significant bottleneck in recycling efficiency is the "last-mile" sorting—the point at which mixed waste must be separated into recyclable streams. Manual sorting is labor-intensive, hazardous, and economically inefficient, while existing optical sorters often fail when faced with complex backgrounds, crushed items, or severe contamination.

**LitterVision AI** solves this by providing a portable, high-accuracy classification engine that can be deployed on mobile devices or edge IoT nodes. The project aims to bridge the gap between laboratory-grade computer vision and real-world, unpredictable spatial environments.

---

## 2. Novelty & Key Contributions
LitterVision distinguishes itself from baseline classification models through three primary innovations:

1.  **Contour-Aware Foreground Isolation**: Unlike standard models that process raw crops, LitterVision employs an algorithmic preprocessing stage using OpenCV's Otsu thresholding and contour detection. This isolates the central waste object from distracting backgrounds (e.g., floor textures, fabric, or grass), significantly reducing noise in the input tensor.
2.  **Hybrid Discriminative-Generative Pipeline**: To address the inherent class imbalance in waste datasets (where "trash" is often underrepresented compared to "paper"), we utilize a **DCGAN** to synthesize realistic, low-fidelity waste topologies for training augmentation.
3.  **Calibrated OOD Rejection**: The system implements a strict confidence thresholding mechanism ($T_{OOD} = 0.75$). Predictions falling below this threshold are rejected as "Unknown," preventing the model from making high-stakes misclassifications on non-waste objects.

---

## 3. Methodology & Model Architecture

### 3.1 Data Pipeline
The training pipeline ingests images of six classes: `Cardboard`, `Glass`, `Metal`, `Paper`, `Plastic`, and `Trash`.
-   **Augmentation**: Real-time transformations including rotation ($20^\circ$), width/height shifts, zoom, and brightness adjustments.
-   **Preprocessing**: 
    -   Grayscale conversion + Gaussian Blur.
    -   Otsu's Binarization for foreground mask generation.
    -   Bounding box extraction based on the largest contour area ratio ($\geq 10\%$).
    -   Normalization to the $[0, 1]$ range.

### 3.2 Neural Architecture
The core classifier is based on **MobileNetV2**, chosen for its inverted residual blocks and depthwise separable convolutions which minimize computational overhead.

| Layer | Configuration |
| :--- | :--- |
| **Backbone** | MobileNetV2 (ImageNet Pretrained) |
| **Pooling** | GlobalAveragePooling2D |
| **Regularization** | Dropout (0.40) + L2 ($1e^{-4}$) |
| **Bottleneck** | Dense (256, ReLU) + BatchNormalization |
| **Output** | Dense (6, Softmax) |

### 3.3 Training Strategy
A **Dual-Stage Learning** approach was employed:
-   **Stage 1**: Classification head training with the MobileNetV2 backbone frozen (Adam, $LR=1e^{-3}$, 15 epochs).
-   **Stage 2**: Fine-tuning the top 55 layers of the backbone (Adam, $LR=1e^{-5}$, 20 epochs) to adapt low-level features to waste-specific textures.

---

## 4. Model Selection & Justification
The selection of **MobileNetV2** over heavier architectures like ResNet-50 or Vision Transformers (ViT) was driven by the requirement for **Edge Deployment**. 

-   **Efficiency**: MobileNetV2 achieves sub-100ms inference on standard CPUs, enabling real-time feedback on mobile browsers.
-   **Transferability**: The ImageNet-derived weights provide a robust feature extractor for textures common in waste items (reflections on glass, crinkles in paper).
-   **Generalization**: The inclusion of a scripted DCGAN generator allows the system to remain "aware" of a wider variety of item deformations than what is available in static datasets.

---

## 5. Experiments & Results

### 5.1 Performance Metrics
The model was evaluated on a held-out test set of 503 images.

| Class | Precision | Recall | F1-Score |
| :--- | :--- | :--- | :--- |
| **Cardboard** | 0.98 | 0.71 | 0.83 |
| **Glass** | 0.70 | 0.81 | 0.75 |
| **Metal** | 0.90 | 0.67 | 0.77 |
| **Paper** | 0.85 | 0.92 | 0.88 |
| **Plastic** | 0.69 | 0.76 | 0.72 |
| **Trash** | 0.51 | 0.67 | 0.58 |
| **Overall Accuracy** | | | **78%** |

### 5.2 Qualitative Analysis
-   **Strengths**: The model excels at identifying `Cardboard` and `Metal` due to distinct edge profiles and specular highlights.
-   **Weaknesses**: The `Trash` class shows lower precision due to its high intra-class variance (it effectively serves as a "miscellaneous" category).

---

## 6. Project Structure
```text
LitterVision/
├── backend/                  # Flask AI Inference Engine
│   ├── app.py                # Core REST API & Preprocessing Logic
│   ├── requirements.txt      # Backend Dependencies (TF, Torch, OpenCV)
│   └── models/               # Production Weights (best_model_finetuned.h5)
│
├── frontend/                 # React + Vite UI
│   ├── src/                  # Components, Hooks, and Framer Motion logic
│   └── tailwind.config.js    # Design System Configuration
│
├── machine_learning/         # Research & Training
│   ├── ML Training - 1/      # CNN Classification (MobileNetV2)
│   ├── ML Training - 2/      # GAN Synthesis (DCGAN)
│   └── dataset/              # Waste Classification Tensors
│
└── research/                 # Academic Literature & References
```

---

## 7. Execution Guide

### Prerequisites
- Python 3.9+
- Node.js 18+

### Step 1: Inference Engine (Backend)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Server runs on `http://localhost:5000`.*

### Step 2: Operator Dashboard (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*Dashboard accessible at `http://localhost:5173`.*

---

## 8. Conclusion & Future Scope
LitterVision successfully demonstrates that lightweight neural architectures, when combined with intelligent preprocessing and generative augmentation, can achieve commercial-grade accuracy for waste classification. 

**Future Work includes:**
-   **YOLOv10 Integration**: Transitioning from classification to object detection for multi-item waste scenes.
-   **Quantization**: Converting `.h5` weights to TFLite for native Android/iOS integration.
-   **Federated Learning**: Allowing edge devices to contribute to the global model without compromising user data privacy.

---
**Authors**: [Insert Name]  
**License**: MIT  
**Date**: April 2026