'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateAndHandleFile = useCallback(
    (file: File) => {
      setErrorMessage(null);

      // Check size limit
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 15MB maximum limit. Please upload a smaller document.`
        );
        return;
      }

      // Check format
      const isAcceptedMime = ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase());
      const isAcceptedExt = ACCEPTED_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isAcceptedMime && !isAcceptedExt) {
        setErrorMessage(
          'Unsupported file format. Please upload a PDF document or an image file (PNG, JPG, JPEG).'
        );
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setIsDragOver(false);
      dragCounter.current = 0;
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    dragCounter.current = 0;

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndHandleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndHandleFile(file);
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload document drag and drop area"
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
          isDragOver
            ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/30 ring-4 ring-indigo-500/10 scale-[1.005]'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:bg-slate-50/50 dark:hover:bg-slate-900/80 shadow-sm'
        } ${disabled ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-200 mb-4 ${
            isDragOver
              ? 'bg-indigo-600 dark:bg-indigo-500 text-white scale-110 shadow-md shadow-indigo-200 dark:shadow-none'
              : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/60 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            {isDragOver ? (
              <span className="text-indigo-600 dark:text-indigo-400">Drop your file right here</span>
            ) : (
              <>
                <span>Drag & drop your document here, or </span>
                <span className="text-indigo-600 dark:text-indigo-400 underline underline-offset-4 decoration-indigo-300 dark:decoration-indigo-600 group-hover:decoration-indigo-600 dark:group-hover:decoration-indigo-400">
                  browse
                </span>
              </>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload PDF documents or scanned images to extract formatted text and generate structured smart summaries.
          </p>
        </div>

        {/* Supported File Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/50">
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Documents</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images (PNG, JPG, JPEG)</span>
          </div>
          <div className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Max 15MB
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm animate-in fade-in slide-in-from-top-1 duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Upload Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
