'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { FileCard } from '@/components/FileCard';
import { LoadingState } from '@/components/LoadingState';
import { ResultsView } from '@/components/ResultsView';
import { performOCR } from '@/lib/ocr';
import { mockDocumentResult } from '@/mock/mockData';
import { DocumentResult, ProcessingStep, SummarizeResponse, ExtractPdfResponse } from '@/types/document';
import { Eye } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [ocrProgressPercent, setOcrProgressPercent] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<DocumentResult | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from localStorage, default to light
  useEffect(() => {
    const savedTheme = localStorage.getItem('docsummary_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('docsummary_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('docsummary_theme', 'light');
      }
      return nextMode;
    });
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);
    setErrorMessage(null);
    setProcessingStep('idle');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResults(null);
    setErrorMessage(null);
    setProcessingStep('idle');
  };

// Safe response parser that prevents "Unexpected token '<'" errors when server returns HTML error pages
async function safeParseJsonResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<{ data: T | null; error: string | null }> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.toLowerCase().includes('application/json');

  if (!isJson) {
    if (response.status === 413) {
      return {
        data: null,
        error: 'The uploaded file exceeds the server upload limit. Please try a smaller document.',
      };
    }
    if (response.status === 504) {
      return {
        data: null,
        error: 'The request timed out while processing. Please try again with a shorter document.',
      };
    }
    if (response.status === 503) {
      return {
        data: null,
        error: 'The service is temporarily unavailable. Please verify that GEMINI_API_KEY is configured in your environment variables.',
      };
    }
    return {
      data: null,
      error: `Server returned an unexpected HTTP ${response.status}${response.statusText ? ` (${response.statusText})` : ''} response instead of JSON.`,
    };
  }

  try {
    const data = await response.json();
    return { data, error: null };
  } catch (err: any) {
    return {
      data: null,
      error: `${fallbackMessage}: ${err?.message || 'Invalid JSON format received from server.'}`,
    };
  }
}

  const handleProcessDocument = async () => {
    if (!selectedFile) return;

    setErrorMessage(null);
    setResults(null);
    setOcrProgressPercent(undefined);

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    let extractedText = '';
    let extractionMethod: 'pdf' | 'ocr' = isPdf ? 'pdf' : 'ocr';
    let pageCount: number | undefined = undefined;

    try {
      // Stage 1: Reading document
      setProcessingStep('reading');
      setStatusMessage('Reading document and validating format...');
      await new Promise((r) => setTimeout(r, 400));

      // Stage 2: Text Extraction / OCR
      if (isPdf) {
        setProcessingStep('extracting');
        setStatusMessage('Extracting formatted text from PDF pages...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        const extractRes = await fetch('/api/extract-pdf', {
          method: 'POST',
          body: formData,
        });

        const { data: extractData, error: parseErr } = await safeParseJsonResponse<
          ExtractPdfResponse & { error?: string }
        >(extractRes, 'Failed to parse PDF extraction response');

        if (parseErr) {
          throw new Error(parseErr);
        }

        if (!extractRes.ok || extractData?.error) {
          throw new Error(extractData?.error || `Failed to extract text from PDF document (HTTP ${extractRes.status}).`);
        }

        if (!extractData || !extractData.text || extractData.text.trim().length === 0) {
          throw new Error(
            'The uploaded PDF does not contain extractable digital text. It may be a purely scanned document or image-only PDF.'
          );
        }

        extractedText = extractData.text;
        pageCount = extractData.numPages;
        extractionMethod = 'pdf';
      } else {
        // Image OCR with Tesseract.js
        setProcessingStep('ocr');
        setStatusMessage('Initializing Tesseract OCR engine...');

        extractedText = await performOCR(selectedFile, (percent, status) => {
          setOcrProgressPercent(percent);
          setStatusMessage(status);
        });

        extractionMethod = 'ocr';
      }

      // Stage 3: Analyzing Content
      setProcessingStep('analyzing');
      setStatusMessage('Analyzing document structure and key themes...');
      await new Promise((r) => setTimeout(r, 600));

      // Stage 4: AI Summarization with Gemini
      setProcessingStep('summarizing');
      setStatusMessage('Synthesizing smart summaries and improvement suggestions via Gemini AI...');

      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          fileName: selectedFile.name,
        }),
      });

      const { data: summarizeData, error: sumParseErr } = await safeParseJsonResponse<
        SummarizeResponse & { error?: string; code?: string }
      >(summarizeRes, 'Failed to parse AI summarization response');

      if (sumParseErr) {
        throw new Error(sumParseErr);
      }

      if (!summarizeRes.ok || summarizeData?.error) {
        throw new Error(summarizeData?.error || `Failed to generate AI summaries (HTTP ${summarizeRes.status}).`);
      }

      if (!summarizeData || !summarizeData.summary) {
        throw new Error('Incomplete summary data received from AI.');
      }

      // Final Stage: Complete
      setResults({
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type || (isPdf ? 'application/pdf' : 'image/png'),
        extractedText: extractedText,
        summary: summarizeData.summary,
        keyPoints: summarizeData.keyPoints,
        improvementSuggestions: summarizeData.improvementSuggestions,
        extractionMethod,
        pageCount,
      });

      setProcessingStep('done');
    } catch (error: any) {
      console.error('Processing error:', error);
      setProcessingStep('error');
      setErrorMessage(error.message || 'An unexpected error occurred during document processing.');
    }
  };

  const handlePreviewMock = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setProcessingStep('done');
    setResults(mockDocumentResult);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResults(null);
    setErrorMessage(null);
    setProcessingStep('idle');
  };

  const isLoading =
    processingStep !== 'idle' &&
    processingStep !== 'done' &&
    processingStep !== 'error';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors duration-200">
      <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
        {/* Hero Banner / Instructions */}
        <section className="text-center space-y-3.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Intelligent Document Summaries in Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload any PDF or scanned image document. The assistant automatically extracts structured text, creates smart summaries across three length options, highlights key ideas, and delivers improvement suggestions.
          </p>

          {!results && !selectedFile && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePreviewMock}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/40 px-3.5 py-1.5 rounded-full font-medium transition-colors border border-indigo-200/80 dark:border-indigo-900/60 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview with Sample Document</span>
              </button>
            </div>
          )}
        </section>

        {/* Upload & Action Section */}
        {!results && !isLoading && processingStep !== 'error' && (
          <section className="space-y-4">
            {!selectedFile ? (
              <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
            ) : (
              <FileCard
                file={selectedFile}
                onRemove={handleRemoveFile}
                onSubmit={handleProcessDocument}
                isLoading={isLoading}
              />
            )}
          </section>
        )}

        {/* Loading & Error State Section */}
        {(isLoading || processingStep === 'error') && (
          <section>
            <LoadingState
              step={processingStep}
              statusMessage={statusMessage}
              progressPercent={ocrProgressPercent}
              error={errorMessage}
              onRetry={handleProcessDocument}
              onCancel={handleReset}
            />
          </section>
        )}

        {/* Results Section */}
        {results && !isLoading && processingStep === 'done' && (
          <section>
            <ResultsView data={results} onReset={handleReset} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Document Summary Assistant • Technical Assessment Submission</span>
          <span className="text-slate-400 dark:text-slate-500">PDF Parsing & Tesseract OCR</span>
        </div>
      </footer>
    </div>
  );
}
