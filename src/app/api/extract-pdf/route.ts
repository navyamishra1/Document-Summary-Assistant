import { NextRequest, NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  let parser: any = null;
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please select a valid PDF document.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller document.` },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF documents are supported at this endpoint.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
      return NextResponse.json(
        { error: 'The uploaded PDF file is empty (0 bytes).' },
        { status: 400 }
      );
    }

    parser = new PDFParse({ data: buffer });
    await parser.load();
    const textResult = await parser.getText();

    let rawText = '';
    let numPages = 1;

    if (textResult) {
      if (typeof textResult === 'string') {
        rawText = textResult;
      } else if (textResult.text) {
        rawText = textResult.text;
        numPages = textResult.total || (textResult.pages ? textResult.pages.length : 1);
      }
    }

    // Clean page header artifacts like "-- 1 of 1 --" if present
    const cleanText = rawText
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
      .replace(/\r\n/g, '\n')
      .trim();

    // Detect if PDF has little or no extractable text (likely image-only / scanned PDF)
    const isScanned = cleanText.replace(/\s/g, '').length < 30;

    return NextResponse.json({
      text: cleanText,
      numPages,
      isScanned,
    });
  } catch (error: any) {
    console.error('Unexpected error in /api/extract-pdf:', error);
    return NextResponse.json(
      { error: `Failed to parse PDF: ${error.message || 'The document might be corrupted or invalid.'}` },
      { status: 422 }
    );
  } finally {
    if (parser && typeof parser.destroy === 'function') {
      try {
        await parser.destroy();
      } catch (destroyErr) {
        // ignore destroy error
      }
    }
  }
}
