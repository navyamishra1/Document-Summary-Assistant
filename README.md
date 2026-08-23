# Document Summary Assistant (`docsummary-assistant`)

A clean, modern single-page application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS** that enables users to upload documents (PDFs and scanned images), extract formatted text, generate smart summaries across multiple length options, extract key takeaways, and view actionable improvement suggestions.

---

## 📋 Features (Step 1 — UI Shell)

- **Intuitive Document Upload**:
  - Drag-and-drop zone with responsive visual states (idle, drag-over highlight, selected file view).
  - Native file picker fallback supporting `.pdf`, `.png`, `.jpg`, and `.jpeg`.
  - Format indicators and file metadata preview (name, type, size).
- **Multi-Length Smart Summaries**:
  - Interactive tabs for **Short** (concise executive overview), **Medium** (balanced context), and **Long** (comprehensive analysis) summaries.
  - One-click copy-to-clipboard for summaries.
- **Key Points & Main Ideas**:
  - High-impact bulleted takeaways highlighting core ideas and metrics.
- **Improvement Suggestions**:
  - Actionable feedback cards for document clarity and structure.
- **Preserved Extracted Text Viewer**:
  - Collapsible container displaying full document text formatting with copy functionality.
- **Visual Loading & Multi-Step States**:
  - Multi-stage pipeline indicator and skeleton placeholders for document analysis.
- **Responsive Design**:
  - Fully responsive layout optimized for desktop, tablet, and mobile screens down to 375px.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+ installed.

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd documentsummary-assistant

# Install dependencies
npm install
```

### Running Locally

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
