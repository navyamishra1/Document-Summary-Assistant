import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Document Summary Assistant
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                AI-powered document analysis and text extraction
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>PDF & Images (OCR)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
