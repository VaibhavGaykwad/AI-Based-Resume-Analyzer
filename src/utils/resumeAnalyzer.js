import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source using the bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

/**
 * Extracts plain text from a PDF File object using pdf.js
 */
export async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText.trim();
}

/**
 * Analyzes resume text using the Gemini API and returns structured JSON results.
 */
export async function analyzeResume(resumeText) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Missing VITE_GEMINI_API_KEY in .env file.');
    }

    const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume text and return a JSON object with EXACTLY this structure (no extra text, just valid JSON):

{
  "name": "Full name extracted from resume",
  "email": "Email from resume or empty string",
  "role": "The primary job title or target role",
  "score": <integer 0-100, honest ATS/quality score>,
  "skills": ["skill1", "skill2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": [
    {
      "id": 1,
      "title": "Short actionable suggestion title",
      "description": "Detailed explanation of the suggestion.",
      "impact": "High" | "Medium" | "Low"
    }
  ]
}

Rules:
- "skills": list up to 12 technical/soft skills you found in the resume.
- "missingKeywords": list 4-7 important keywords relevant to the role that are MISSING from the resume.
- "suggestions": provide exactly 3 suggestions ranked by impact (High first).
- "score": be honest. A weak resume should score 40-60. A strong one 75-90.
- Return ONLY the JSON object, no markdown fences, no explanation.

Resume Text:
---
${resumeText.slice(0, 8000)}
---`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    responseMimeType: 'application/json',
                },
            }),
        }
    );

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
        throw new Error('No response from Gemini API.');
    }

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleaned);
}
