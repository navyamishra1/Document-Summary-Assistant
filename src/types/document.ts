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
}

export type ProcessingStep = 'idle' | 'parsing' | 'extracting' | 'summarizing' | 'done';
