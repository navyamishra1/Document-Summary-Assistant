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
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      {/* Top spinner and main title */}
      <div className="flex flex-col items-center justify-center text-center space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-blue-600">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Analyzing Document
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-0.5">
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
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                  : status === 'active'
                  ? 'bg-blue-50/80 border-blue-200 text-blue-800 font-medium ring-1 ring-blue-200'
                  : 'bg-slate-50/50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    status === 'completed'
                      ? 'bg-emerald-100 text-emerald-700'
                      : status === 'active'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-500'
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
      <div className="space-y-3 pt-4 border-t border-slate-100 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-5/6" />
          <div className="h-3 bg-slate-100 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};
