import { NextRequest, NextResponse } from 'next/server';
import { extractText } from 'unpdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: 'Failed to read uploaded file form data. Please ensure a valid file is selected.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please select a valid PDF document.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File size exceeds the 15MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller document.` },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const fileName = (file.name || '').toLowerCase();
    if (!fileName.endsWith('.pdf') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF documents are supported at this endpoint.' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    if (arrayBuffer.byteLength === 0) {
      return NextResponse.json(
        { error: 'The uploaded PDF file is empty (0 bytes).' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const uint8Array = new Uint8Array(arrayBuffer);
    const { text, totalPages } = await extractText(uint8Array, { mergePages: true });

    const rawText = typeof text === 'string' ? text : Array.isArray(text) ? (text as string[]).join('\n\n') : '';
    const numPages = typeof totalPages === 'number' && totalPages > 0 ? totalPages : 1;

    // Clean page header artifacts and normalize whitespace/line breaks
    const cleanText = rawText
      .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
      .replace(/\r\n/g, '\n')
      .trim();

    // Detect if PDF has little or no extractable text (likely image-only / scanned PDF)
    const isScanned = cleanText.replace(/\s/g, '').length < 30;

    return NextResponse.json(
      {
        text: cleanText,
        numPages,
        isScanned,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Unexpected error in /api/extract-pdf:', error);
    return NextResponse.json(
      { error: `Failed to parse PDF: ${error?.message || 'The document might be corrupted or invalid.'}` },
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
