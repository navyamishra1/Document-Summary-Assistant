'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  ListChecks, 
  Lightbulb, 
  Copy, 
  Check, 
  Download,
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  AlignLeft
} from 'lucide-react';
import { DocumentResult, SummaryLength } from '@/types/document';

interface ResultsViewProps {
  data: DocumentResult;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset }) => {
  const [selectedLength, setSelectedLength] = useState<SummaryLength>('medium');
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(data.summary[selectedLength]);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch (err) {
      console.error('Failed to copy summary:', err);
    }
  };

  const handleCopyExtractedText = async () => {
    try {
      await navigator.clipboard.writeText(data.extractedText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadSummary = () => {
    const content = `DOCUMENT SUMMARY: ${data.fileName}
Length: ${selectedLength.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

========================================
SUMMARY
========================================
${data.summary[selectedLength]}

========================================
KEY POINTS & MAIN IDEAS
========================================
${data.keyPoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

========================================
IMPROVEMENT SUGGESTIONS
========================================
${data.improvementSuggestions.map((sug, i) => `• ${sug}`).join('\n')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.fileName.replace(/\.[^/.]+$/, '')}_${selectedLength}_summary.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const summaryTabs: { id: SummaryLength; label: string; description: string }[] = [
    { id: 'short', label: 'Short', description: 'Concise summary' },
    { id: 'medium', label: 'Medium', description: 'Balanced overview' },
    { id: 'long', label: 'Long', description: 'Comprehensive details' },
  ];

  return (
    <div className="space-y-6">
      {/* Top summary header card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {data.fileName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analysis complete • {(data.fileSize / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-xl transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Upload Another Document</span>
        </button>
      </div>

      {/* 1. Summary Generation Section (Short, Medium, Long) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Document Summary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select desired summary depth</p>
            </div>
          </div>

          {/* Length Selector Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {summaryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLength(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedLength === tab.id
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Content */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800">
            {data.summary[selectedLength]}
          </div>

          {/* Action Buttons: Copy & Download */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleDownloadSummary}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Summary</span>
            </button>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied summary</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy summary</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Points & Main Ideas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Key Points & Main Ideas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Core highlights and takeaways from the document</p>
          </div>
        </div>

        <ul className="space-y-2.5 pt-1">
          {data.keyPoints.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center justify-center text-xs shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. Improvement Suggestions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Improvement Suggestions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Recommendations for enhancing clarity and structure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {data.improvementSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
            >
              <span className="text-amber-600 dark:text-amber-400 font-bold text-base leading-none">•</span>
              <span className="leading-relaxed">{suggestion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Extracted Text (with original formatting) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors">
        <button
          type="button"
          onClick={() => setShowExtractedText(!showExtractedText)}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <AlignLeft className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Raw Extracted Text</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Preserved formatting from PDF parsing / OCR extraction
              </p>
            </div>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            {showExtractedText ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        {showExtractedText && (
          <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleCopyExtractedText}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Raw Text</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 bg-slate-900 dark:bg-slate-950 text-slate-100 border border-slate-800 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto max-h-96 whitespace-pre-wrap leading-relaxed">
              {data.extractedText}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
