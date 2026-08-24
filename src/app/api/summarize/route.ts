import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { SummarizeResponse } from '@/types/document';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, fileName } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No extracted text provided for summarization.' },
        { status: 400 }
      );
    }

    const cleanText = text.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json(
        {
          error:
            'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env.local file to enable AI summarization.',
          code: 'MISSING_API_KEY',
        },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are an expert document analysis assistant. Analyze the following document text extracted from "${fileName || 'uploaded document'}".

Your task is to generate:
1. "short": A very concise executive summary (2-3 sentences max) capturing the core purpose and most critical outcome/takeaway.
2. "medium": A balanced summary (1-2 well-structured paragraphs, ~120-180 words) providing context, key details, and conclusions.
3. "long": A comprehensive, detailed summary (~250-400 words) breaking down the document's sections, background, key figures, methodologies, and complete implications.
4. "keyPoints": An array of 4 to 7 high-impact, specific bullet points representing the main ideas, metrics, or arguments.
5. "improvementSuggestions": An array of 3 to 5 constructive, actionable suggestions to improve the document (e.g. clarity, structure, missing data, organization, readability).

Strict requirements:
- Base all summaries, key points, and suggestions solely on the actual document text provided below.
- Do not invent facts or metrics not present in the text.
- Return ONLY valid JSON matching this exact structure:
{
  "summary": {
    "short": "string",
    "medium": "string",
    "long": "string"
  },
  "keyPoints": ["string", "string"],
  "improvementSuggestions": ["string", "string"]
}

DOCUMENT TEXT:
${cleanText.slice(0, 50000)}
`;

    // Try models in order: gemini-2.5-flash -> gemini-1.5-flash -> gemini-2.0-flash
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let resultText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const result = await model.generateContent(prompt);
        resultText = result.response.text();
        if (resultText) break;
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or unavailable:`, err?.message);
        lastError = err;
      }
    }

    if (!resultText) {
      throw lastError || new Error('Failed to generate summary from Gemini AI models.');
    }

    let parsedResult: SummarizeResponse;
    try {
      // Clean possible markdown code fences if present
      const jsonStr = resultText
        .replace(/^```json\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsedResult = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.error('Failed to parse Gemini JSON response:', resultText);
      throw new Error('AI returned an unparseable response format.');
    }

    if (
      !parsedResult.summary ||
      !parsedResult.summary.short ||
      !parsedResult.summary.medium ||
      !parsedResult.summary.long ||
      !Array.isArray(parsedResult.keyPoints) ||
      !Array.isArray(parsedResult.improvementSuggestions)
    ) {
      throw new Error('AI response is missing required summary fields.');
    }

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error('Error in /api/summarize:', error);
    
    // Provide clean, understandable error messages
    let userMessage = error.message || 'AI summarization failed.';
    if (userMessage.includes('API_KEY_INVALID') || userMessage.includes('API key not valid')) {
      userMessage = 'Invalid Gemini API Key. Please verify your GEMINI_API_KEY in .env.local.';
    } else if (userMessage.includes('RESOURCE_EXHAUSTED') || userMessage.includes('quota')) {
      userMessage = 'Gemini API rate limit or quota exceeded. Please wait a few moments and try again.';
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    );
  }
}
