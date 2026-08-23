'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { FileCard } from '@/components/FileCard';
import { LoadingState } from '@/components/LoadingState';
import { ResultsView } from '@/components/ResultsView';
import { mockDocumentResult } from '@/mock/mockData';
import { DocumentResult, ProcessingStep } from '@/types/document';
import { Sparkles, Eye, Info } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [results, setResults] = useState<DocumentResult | null>(null);

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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Hero Banner / Instructions */}
        <section className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Intelligent Document Summaries in Seconds
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload any PDF or scanned image document. The assistant automatically extracts structured text, creates smart summaries across three length options, highlights key ideas, and delivers improvement suggestions.
          </p>

          {!results && !selectedFile && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePreviewMock}
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-full font-medium transition-colors border border-blue-200"
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
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Document Summary Assistant • Technical Assessment UI Shell</span>
          <span className="text-slate-400">PDF Parsing & OCR Ready</span>
        </div>
      </footer>
    </div>
  );
}
