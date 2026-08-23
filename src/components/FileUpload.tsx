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
      const isAcceptedMime = ACCEPTED_MIME_TYPES.includes(file.type.toLowerCase());
      const isAcceptedExt = ACCEPTED_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (!isAcceptedMime && !isAcceptedExt) {
        setErrorMessage(
          'Unsupported file format. Please upload a PDF or an image (PNG, JPG, JPEG).'
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
      // Reset input value so re-selecting same file triggers onChange
      e.target.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
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
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/70 ring-4 ring-blue-500/10 scale-[1.005]'
            : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50'
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
              ? 'bg-blue-600 text-white scale-110 shadow-md shadow-blue-200'
              : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:scale-105'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            {isDragOver ? (
              <span className="text-blue-600">Drop your file right here</span>
            ) : (
              <>
                <span>Drag & drop your document here, or </span>
                <span className="text-blue-600 underline underline-offset-4 decoration-blue-300 group-hover:decoration-blue-600">
                  browse
                </span>
              </>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload PDF documents or scanned images to extract formatted text and generate structured summaries.
          </p>
        </div>

        {/* Supported File Indicators */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100">
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Documents</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Images (PNG, JPG, JPEG)</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
