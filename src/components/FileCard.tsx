import React from 'react';
import { FileText, Image as ImageIcon, X, ArrowRight } from 'lucide-react';

interface FileCardProps {
  file: File;
  onRemove: () => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export const FileCard: React.FC<FileCardProps> = ({
  file,
  onRemove,
  onSubmit,
  isLoading = false,
}) => {
  const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            isPdf 
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50' 
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50'
          }`}>
            {isPdf ? <FileText className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {file.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              <span className={`font-medium px-1.5 py-0.5 rounded text-[11px] uppercase ${
                isPdf 
                  ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300' 
                  : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
              }`}>
                {isPdf ? 'PDF Document' : 'Scanned Image'}
              </span>
              <span>•</span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onRemove}
            disabled={isLoading}
            className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            title="Remove file"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-200/50 dark:shadow-none transition-colors"
          >
            <span>Summarize Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
