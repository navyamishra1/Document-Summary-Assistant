import React from 'react';
import { 
  Loader2, 
  FileSearch, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  XCircle,
  Cpu
} from 'lucide-react';
import { ProcessingStep } from '@/types/document';

interface LoadingStateProps {
  step: ProcessingStep;
  statusMessage?: string;
  progressPercent?: number;
  error?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  step,
  statusMessage,
  progressPercent,
  error,
  onRetry,
  onCancel,
}) => {
  const steps = [
    { id: 'reading', label: 'Reading & Validating Document', icon: FileSearch },
    { 
      id: 'extracting', 
      label: step === 'ocr' ? 'OCR Optical Character Recognition' : 'Extracting Formatted Text', 
      icon: Cpu 
    },
    { id: 'analyzing', label: 'Analyzing Document Structure', icon: FileSearch },
    { id: 'summarizing', label: 'Synthesizing Smart Summaries & Insights', icon: Sparkles },
  ];

  const getStepStatus = (stepId: string) => {
    if (step === 'error') {
      return 'error';
    }
    const order = ['reading', 'extracting', 'ocr', 'analyzing', 'summarizing', 'done'];
    const currentIndex = order.indexOf(step);
    let targetIndex = order.indexOf(stepId);
    if (stepId === 'extracting' && (step === 'ocr' || order.indexOf(step) >= order.indexOf('ocr'))) {
      targetIndex = 1;
    }

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex || (step === 'ocr' && stepId === 'extracting')) return 'active';
    return 'pending';
  };

  // Error State View
  if (step === 'error' && error) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              Processing Failed
            </h3>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 max-w-md mt-1 leading-relaxed">
              {error}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Choose Another File</span>
            </button>
          )}
        </div>
      </div>
    );
  }

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
            Processing Document
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
            {statusMessage || 'Extracting content and synthesizing smart summaries...'}
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-md mx-auto space-y-2.5">
        {steps.map((item) => {
          const status = getStepStatus(item.id);
          const Icon = item.icon;
          const isOcrStep = (item.id === 'extracting' && step === 'ocr');

          return (
            <div
              key={item.id}
              className={`flex flex-col p-3 rounded-xl border transition-all text-xs sm:text-sm ${
                status === 'completed'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
                  : status === 'active'
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-800 dark:text-indigo-300 font-medium ring-1 ring-indigo-200 dark:ring-indigo-900/50'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
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
                  {status === 'active' && (
                    isOcrStep && typeof progressPercent === 'number'
                      ? `${progressPercent}%`
                      : 'In Progress'
                  )}
                  {status === 'pending' && 'Queued'}
                </span>
              </div>

              {/* Real OCR Progress Bar when active and percentage is known */}
              {isOcrStep && typeof progressPercent === 'number' && (
                <div className="mt-2.5 pt-2 border-t border-indigo-100 dark:border-indigo-900/40">
                  <div className="w-full bg-indigo-200/60 dark:bg-indigo-900/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-200 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
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
