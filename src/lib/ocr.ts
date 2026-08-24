import { createWorker } from 'tesseract.js';

/**
 * Performs optical character recognition on an image file using Tesseract.js.
 * Reports real-time recognition progress to the caller.
 * 
 * @param imageFile - Image file or Blob (PNG, JPG, JPEG)
 * @param onProgress - Optional callback receiving actual percentage (0-100) and status message
 * @returns Cleaned extracted text string
 */
export async function performOCR(
  imageFile: File | Blob,
  onProgress?: (progress: number, status: string) => void
): Promise<string> {
  try {
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text' && typeof m.progress === 'number') {
          const percent = Math.min(100, Math.max(0, Math.round(m.progress * 100)));
          if (onProgress) {
            onProgress(percent, `Recognizing text (${percent}%)`);
          }
        } else if (m.status) {
          // Format internal status (e.g. "loading_tesseract" -> "Loading Tesseract core")
          const cleanStatus = m.status
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
          if (onProgress) {
            onProgress(0, cleanStatus);
          }
        }
      },
    });

    const ret = await worker.recognize(imageFile);
    await worker.terminate();

    const extractedText = (ret.data.text || '').trim();
    if (!extractedText) {
      throw new Error(
        'No legible text could be detected in this image. Please ensure the document is clear, well-lit, and in focus.'
      );
    }

    return extractedText;
  } catch (error: any) {
    console.error('Tesseract OCR error:', error);
    if (error.message && error.message.includes('No legible text')) {
      throw error;
    }
    throw new Error(
      `OCR processing failed: ${error.message || 'Unable to read image content.'}. Please try another file.`
    );
  }
}
