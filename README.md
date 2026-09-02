# Document Summary Assistant (`docsummary-assistant`)

> 🚀 **Live Demo**: [https://document-summary-assistant-two-flame.vercel.app](https://document-summary-assistant-two-flame.vercel.app)  
> 📦 **GitHub Repository**: [https://github.com/navyamishra1/Document-Summary-Assistant](https://github.com/navyamishra1/Document-Summary-Assistant)

A high-performance, accessible single-page web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. It enables users to upload documents (digital PDFs or scanned images), automatically extracts structured text via PDF parsing and Optical Character Recognition (OCR), and synthesizes multi-length smart summaries, key takeaways, and improvement suggestions using Google Gemini AI.

---

## 📑 Approach Write-up (Technical Assessment Summary)

> **Architectural & Technical Approach (Under 200 words):**  
> *The Document Summary Assistant is engineered as a streamlined, responsive single-page application utilizing Next.js 14 App Router and TypeScript. Document processing dynamically branches based on MIME type: digital PDFs are parsed server-side using `unpdf` to preserve structural formatting and line breaks without native binary or canvas dependencies; image files (PNG, JPG, JPEG) and scanned documents are processed via a web worker running `tesseract.js`, providing genuine real-time recognition progress (0–100%) directly to the user interface.*
>
> *Extracted text is transmitted to a protected server-side route where Google Gemini AI (`gemini-3.6-flash` with fallback to `gemini-3.5-flash`) applies structured prompt engineering to generate deterministic JSON payloads containing Short (~2-3 sentence briefing), Medium (~1-2 paragraph context), and Long (comprehensive breakdown) summaries, alongside ranked Key Points and actionable Improvement Suggestions. The UI is built with Tailwind CSS, featuring class-based Light/Dark theme persistence, staged loading indicators with error recovery, copy/download report actions, and full mobile responsiveness down to 375px.*

---

## 🚀 Key Features & Capabilities

1. **Document Ingestion & Validation**:
   - Drag-and-drop zone and native file picker fallback.
   - Supports `.pdf`, `.png`, `.jpg`, and `.jpeg` up to 15MB.
   - Client-side validation with inline error messaging.

2. **Digital PDF Text Extraction**:
   - Server-side parsing (`unpdf`) preserving paragraph and line layout without serverless canvas crashes.
   - Detects corrupted files, empty documents, and scanned image-only PDFs.

3. **Real Optical Character Recognition (OCR)**:
   - Powered by `tesseract.js` running in browser workers.
   - Real-time progress updates (`Recognizing text: XX%`) with live progress bars.

4. **Multi-Length Smart Summaries**:
   - **Short Summary**: Concise executive briefing (2–3 sentences) focusing on core outcomes.
   - **Medium Summary**: Balanced context (1–2 paragraphs, ~120–180 words).
   - **Long Summary**: In-depth analysis (~250–400 words) covering background, metrics, and implications.

5. **Key Points & Improvement Suggestions**:
   - Ranked bulleted list of essential takeaways and metrics.
   - Constructive suggestions evaluating document clarity, structure, organization, and completeness.

6. **Results Actions & UX**:
   - Monospace raw extracted text viewer with expand/collapse.
   - One-click **Copy Summary** and **Download Report** (`.txt` formatted export).
   - Staged loading animations with failure recovery and "Try Again" handling.
   - Light/Dark theme toggle with `localStorage` persistence.
   - Fully responsive down to 375px mobile viewport width.

---

## 🏗️ Architecture & Data Pipeline

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
- **OCR Engine**: [`tesseract.js`](https://tesseract.projectnaptha.com/)
- **AI Model**: [Google Gemini 3.6 Flash / 3.5 Flash](https://ai.google.dev/) (`@google/generative-ai`)
- **Icons**: [`lucide-react`](https://lucide.dev/)

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Obtain your free API key at: https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Security Note**: `GEMINI_API_KEY` is strictly accessed in server-side API routes (`/api/summarize`) and is never exposed in client bundles.

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
| **Invalid Format** | Attempt uploading `.docx`, `.txt`, `.exe` | Immediate inline validation error; UI remains responsive. |
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
3. Add the Environment Variable:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Click **Deploy**.

