# 🪙 Plum8 – Automated Financial Amount Extraction & Classification

**Plum8** is a robust, two-part microservice architecture designed to **automatically extract, normalize, and classify financial amounts** from various inputs — particularly simulating **noisy medical bills**.  
It provides an **end-to-end pipeline** with three major steps:

1. 🧪 **Extraction** – OCR & raw numeric detection  
2. 🧹 **Normalization** – AI-powered cleaning and structured parsing  
3. 🧠 **Classification** – Type mapping and provenance generation  

All results are output as a **clean, provenance-rich JSON** response (Step 4).

---

## 🚀 Features

- 📸 Handles **text**, **image files**, and **image URLs** as input  
- 🔠 Uses **OCR** (OpenCV + Tesseract) for text extraction from images  
- 🤖 Integrates **LLM APIs (Groq)** for semantic text cleaning and normalization  
- 🔄 Cross-language communication between **Node.js** and **Python** microservices  
- 🧾 Produces a **fully structured JSON** with provenance, confidence scores, and source references

---

## 🏗️ Architecture Overview

Plum8 consists of two main services working together:

| Component | Technology | Role |
| :--- | :--- | :--- |
| **API Gateway (Backend)** | Node.js (ES Modules), Express.js, Axios, Multer | Handles routing, input classification, pipeline orchestration, and response formatting |
| **OCR Microservice** | Python, Flask, OpenCV, pytesseract | Handles image preprocessing and text extraction |
| **AI/LLM Core** | Groq API (`llama-3.3-70b-versatile` or `mixtral-8x7b-32768`) | Cleans and normalizes extracted text |
| **Configuration** | `.env`, `VarEnv.js`, `dotenv` | Manages API keys and service URLs |

---

## 🔄 Data Flow (Pipeline)

The pipeline supports **three input types**:
- 📝 Raw Text
- 🖼️ Image File
- 🔗 Image Path (URL)

### 1. Input & Routing (`processRoute.js`, `classifyInput.js`)

- **Classification:** Determines the input type (`image_file`, `image_path`, `text`).  
- **Routing:** Directs input to the correct controller:  
  - `textCombineController.js` – Text input  
  - `fileController.js` / `pathController.js` – Image input  

---

### 2. Image Processing (Python OCR Service)

1. **Node → Python:** Sends image data to Flask (`/process-image`)  
2. **OCR Pipeline:**  
   - `preprocessing.py` – Grayscale, thresholding, noise removal  
   - `postprocessing.py` – Tesseract OCR → Groq API for semantic cleaning  
3. **Return:** Clean text (`extracted_text`) returned to Node.js  

---

### 3. Central Processing Pipeline (`textCombineController.js`)

| Step | Module | Function |
| :--- | :--- | :--- |
| **1. Extraction** | `extractTextData` | Extract numeric tokens, detect `currency_hint`, compute `step1_confidence` |
| **2. Normalization** | `normalizeData` | Send raw text to Groq API, correct OCR errors, extract structured data |
| **3. Classification** | `classifyData` | Map type-value pairs into final structure, add `source` provenance |

---

## ✅ Final Output (Step 4)

All processed data is merged into a final JSON response:

```json
{
  "currency": "USD",
  "amounts": [
    {
      "type": "total",
      "value": 1200,
      "source": "ocr: 'Total: 1200'"
    }
  ],
  "status": "ok",
  "provenance": {
    "step1_confidence": 0.92,
    "step2_confidence": 0.98,
    "raw_tokens": ["1200", "Total"]
  }
}
