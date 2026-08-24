export type SummaryLength = 'short' | 'medium' | 'long';

export interface DocumentSummary {
  short: string;
  medium: string;
  long: string;
}

export interface DocumentResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  extractedText: string;
  summary: DocumentSummary;
  keyPoints: string[];
  improvementSuggestions: string[];
  extractionMethod?: 'pdf' | 'ocr';
  pageCount?: number;
}

export type ProcessingStep = 
  | 'idle' 
  | 'reading' 
  | 'extracting' 
  | 'ocr' 
  | 'analyzing' 
  | 'summarizing' 
  | 'done' 
  | 'error';

export interface ProcessingProgress {
  stage: ProcessingStep;
  message: string;
  percent?: number;
  error?: string;
}

export interface SummarizeRequest {
  text: string;
  fileName: string;
}

export interface SummarizeResponse {
  summary: DocumentSummary;
  keyPoints: string[];
  improvementSuggestions: string[];
}

export interface ExtractPdfResponse {
  text: string;
  numPages: number;
  isScanned: boolean;
}
