import React from 'react';
import { Loader2, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';
import { ProcessingStep } from '@/types/document';

interface LoadingStateProps {
  step?: ProcessingStep;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  step = 'parsing',
}) => {
  const steps = [
    { id: 'parsing', label: 'Document Parsing & OCR', icon: FileSearch },
    { id: 'extracting', label: 'Extracting Formatted Text', icon: FileSearch },
    { id: 'summarizing', label: 'Generating Smart Summaries & Insights', icon: Sparkles },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ['parsing', 'extracting', 'summarizing', 'done'];
    const currentIndex = order.indexOf(step);
    const targetIndex = order.indexOf(stepId);

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 transition-colors">
      {/* Top spinner and main title */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-indigo-100 dark:border-indigo-950/60 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            Analyzing Document
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
            Extracting text content, running OCR for scanned pages, and synthesizing smart summaries...
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto space-y-2.5">
        {steps.map((item) => {
          const status = getStepStatus(item.id);
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all text-xs sm:text-sm ${
                status === 'completed'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                  : status === 'active'
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium ring-1 ring-indigo-200 dark:ring-indigo-900/50'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      : status === 'active'
                      ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : status === 'active' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <span>{item.label}</span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {status === 'completed' && 'Done'}
                {status === 'active' && 'In Progress'}
                {status === 'pending' && 'Queued'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Skeletons for UX */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6" />
          <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};
