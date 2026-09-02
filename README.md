# Document Summary Assistant (`docsummary-assistant`)

> 🚀 **Live Demo**: [https://document-summary-assistant-two-flame.vercel.app](https://document-summary-assistant-two-flame.vercel.app)  
> 📦 **GitHub Repository**: [https://github.com/navyamishra1/Document-Summary-Assistant](https://github.com/navyamishra1/Document-Summary-Assistant)

An AI-powered single-page web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It enables users to upload digital PDF documents or scanned images, automatically extracts structured text via serverless-compatible PDF parsing (`unpdf`) or browser-based Optical Character Recognition (`tesseract.js`), and synthesizes multi-length smart summaries, key takeaways, and improvement suggestions using Google Gemini AI (`gemini-3.6-flash` / `gemini-3.5-flash`).

---

## 📑 Technical Approach & Architecture

> **Architectural & Technical Approach:**  
> *The Document Summary Assistant is engineered as a responsive single-page application utilizing the Next.js 14 App Router and TypeScript. Document processing dynamically branches based on file type:*
> - *Digital PDFs are processed server-side via `/api/extract-pdf` using `unpdf`, providing serverless-compatible PDF text extraction.*
> - *Image files (PNG, JPG, JPEG) and scanned documents are processed in the browser using a `tesseract.js` Web Worker, streaming real-time recognition progress (0–100%) to the user interface.*
>
> *Extracted text is sent to the protected server-side route `/api/summarize`, where Google Gemini AI (`gemini-3.6-flash` with fallback to `gemini-3.5-flash`) applies structured prompt engineering with strict JSON output constraints. The API returns structured payloads containing Short (concise briefing), Medium (balanced context), and Long (comprehensive breakdown) summaries, alongside ranked Key Points and actionable Improvement Suggestions. The UI is built with Tailwind CSS, featuring Light/Dark theme persistence, staged loading indicators with failure recovery, one-click copy and `.txt` report downloads, and mobile responsiveness down to 375px.*

---

## 🚀 Key Features

1. **Document Ingestion & Validation**:
   - Drag-and-drop zone and native file picker.
   - Supports `.pdf`, `.png`, `.jpg`, and `.jpeg` up to 15MB.
   - Client-side validation with inline error messaging.

2. **Digital PDF Text Extraction**:
   - Server-side parsing (`unpdf`) preserving paragraph and line layout in serverless environments.
   - Detects empty documents and scanned image-only PDFs.

3. **Optical Character Recognition (OCR)**:
   - Powered by `tesseract.js` running in browser Web Workers.
   - Real-time progress updates with live progress percentage indicators.

4. **Multi-Length Smart Summaries**:
   - **Short Summary**: Concise executive briefing (2–3 sentences) highlighting core outcomes.
   - **Medium Summary**: Balanced overview (1–2 paragraphs, ~120–180 words) providing context and details.
   - **Long Summary**: Detailed analysis (~250–400 words) covering background, key figures, and implications.

5. **Key Points & Improvement Suggestions**:
   - Ranked bulleted list of 4–7 essential takeaways and metrics.
   - 3–5 constructive, actionable suggestions evaluating document structure, clarity, and readability.

6. **User Experience & Export Actions**:
   - Collapsible monospace viewer for raw extracted text with copy functionality.
   - One-click **Copy Summary** and **Download Report** (`.txt` formatted report).
   - "Preview with Sample Document" mode for instant evaluation without uploading.
   - Multi-step loading stepper with error retry capability.
   - Light/Dark theme toggle persisted in `localStorage`.
   - Responsive layout optimized for mobile, tablet, and desktop viewports.

---

## 🏗️ Architecture & Data Flow

```
[User Document Upload]
         │
    ┌────┴────────────────────────┐
    ▼                             ▼
[PDF Document]             [Image: PNG/JPG/JPEG]
    │                             │
    ▼                             ▼
[POST /api/extract-pdf]    [Tesseract.js Web Worker]
  (Server-side unpdf)       (Live progress callbacks 0-100%)
    │                             │
    └──────────────┬──────────────┘
                   ▼
        [Clean Extracted Text]
                   │
                   ▼
         [POST /api/summarize]
       (Server-side Gemini AI)
       (gemini-3.6-flash / 3.5-flash)
                   │
                   ▼
      [Structured JSON Response]
   ├── Short / Medium / Long Summaries
   ├── Key Points & Main Ideas
   └── Improvement Suggestions
                   │
                   ▼
          [Interactive UI View]
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **PDF Engine**: [`unpdf`](https://github.com/unjs/unpdf) (Pure JS, Serverless-compatible)
- **OCR Engine**: [`tesseract.js`](https://tesseract.projectnaptha.com/) (Browser Web Worker)
- **AI Model**: [Google Gemini 3.6 Flash / 3.5 Flash](https://ai.google.dev/) via `@google/generative-ai`
- **Icons**: [`lucide-react`](https://lucide.dev/)

---

## 🔌 API Routes

### 1. `POST /api/extract-pdf`
- **Purpose**: Extracts plain text from an uploaded digital PDF document.
- **Request**: `multipart/form-data` containing a `file` field (`application/pdf`, max 15MB).
- **Response**:
  ```json
  {
    "text": "Extracted document text...",
    "numPages": 3,
    "isScanned": false
  }
  ```

### 2. `POST /api/summarize`
- **Purpose**: Generates multi-length summaries, key points, and suggestions using Gemini AI.
- **Request**: `application/json`
  ```json
  {
    "text": "Document text content...",
    "fileName": "example.pdf"
  }
  ```
- **Response**:
  ```json
  {
    "summary": {
      "short": "Concise 2-3 sentence executive briefing.",
      "medium": "Balanced 1-2 paragraph summary.",
      "long": "Detailed comprehensive breakdown."
    },
    "keyPoints": ["Point 1", "Point 2", "Point 3"],
    "improvementSuggestions": ["Suggestion 1", "Suggestion 2"]
  }
  ```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Obtain your free API key at: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note**: `GEMINI_API_KEY` is strictly accessed in server-side API routes (`/api/summarize`) and is never exposed to client-side code or network responses.

---

## 💻 Local Setup & Execution

### 1. Prerequisites
- Node.js 18.17+ or 20+ installed.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/navyamishra1/Document-Summary-Assistant.git
cd Document-Summary-Assistant

# Install dependencies
npm install
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Start
```bash
npm run build
npm run start
```

---

## 🧪 Testing Guide

| Test Scenario | Steps | Expected Outcome |
| :--- | :--- | :--- |
| **Digital PDF Upload** | Drop/select any standard text PDF | Extracts text via `/api/extract-pdf`, generates all 3 summary lengths, key points, suggestions. |
| **Scanned Image OCR** | Drop/select PNG/JPG invoice, article, or receipt | Shows real OCR progress (0% &rarr; 100%), extracts text, generates summaries. |
| **Sample Preview** | Click "Preview with Sample Document" | Instantly loads mock financial report analysis with all tabs. |
| **Invalid Format** | Attempt uploading unsupported formats | Immediate inline validation error; UI remains responsive. |
| **Oversized File** | Attempt uploading file > 15MB | Clear size limit error with guidance. |
| **Missing API Key** | Run without `GEMINI_API_KEY` set | Clean error state with instructions on setting the key and a "Try Again" button. |
| **Export Features** | Click "Copy Summary" & "Download Report" | Clipboard updated with active summary; downloads complete `.txt` report. |
| **Theme Toggle** | Click Sun/Moon button | Toggles dark/light mode across entire UI; persists on reload. |
| **Mobile Viewport** | Open DevTools at 375px width (iPhone SE) | UI stacks cleanly with no horizontal scroll or clipped text. |

---

## 🚢 Deployment Guide

The application is deployed live on **Vercel**:
- **Live URL**: [https://document-summary-assistant-two-flame.vercel.app](https://document-summary-assistant-two-flame.vercel.app)

### Deploying Your Own Instance on Vercel:
1. Push your repository to GitHub.
2. Import the repository into the [Vercel Dashboard](https://vercel.com).
3. Add the Environment Variable in Project Settings:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Click **Deploy**.


