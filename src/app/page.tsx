'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { FileCard } from '@/components/FileCard';
import { LoadingState } from '@/components/LoadingState';
import { ResultsView } from '@/components/ResultsView';
import { mockDocumentResult } from '@/mock/mockData';
import { DocumentResult, ProcessingStep } from '@/types/document';
import { Eye } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
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
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResults(null);
    setProcessingStep('idle');
  };

  const handleSummarize = () => {
    if (!selectedFile) return;

    setProcessingStep('parsing');

    // Simulate multi-step pipeline progression for UI demonstration
    setTimeout(() => {
      setProcessingStep('extracting');
    }, 900);

    setTimeout(() => {
      setProcessingStep('summarizing');
    }, 1800);

    setTimeout(() => {
      // For STEP 1 UI Shell, populate with placeholder/mock result adapted to selected file
      setResults({
        ...mockDocumentResult,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/png'),
      });
      setProcessingStep('done');
    }, 2800);
  };

  const handlePreviewMock = () => {
    setSelectedFile(null);
    setProcessingStep('done');
    setResults(mockDocumentResult);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResults(null);
    setProcessingStep('idle');
  };

  const isLoading = processingStep !== 'idle' && processingStep !== 'done';

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
        {!results && !isLoading && (
          <section className="space-y-4">
            {!selectedFile ? (
              <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
            ) : (
              <FileCard
                file={selectedFile}
                onRemove={handleRemoveFile}
                onSubmit={handleSummarize}
                isLoading={isLoading}
              />
            )}
          </section>
        )}

        {/* Loading State Section */}
        {isLoading && (
          <section>
            <LoadingState step={processingStep} />
          </section>
        )}

        {/* Results Section */}
        {results && !isLoading && (
          <section>
            <ResultsView data={results} onReset={handleReset} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Document Summary Assistant • Technical Assessment UI Shell</span>
          <span className="text-slate-400 dark:text-slate-500">PDF Parsing & OCR Ready</span>
        </div>
      </footer>
    </div>
  );
}
