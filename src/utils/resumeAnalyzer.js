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
 * Analyzes resume text using either the OpenRouter API or Gemini API and returns structured JSON results.
 */
export async function analyzeResume(resumeText) {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const apiKey = openRouterKey || geminiKey;

    if (!apiKey) {
        throw new Error('Missing VITE_OPENROUTER_API_KEY or VITE_GEMINI_API_KEY in .env file.');
    }

    const isOpenRouter = apiKey.startsWith('sk-or-');

    const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume text and return a JSON object with EXACTLY this structure (no extra text, just valid JSON):

{
  "name": "Full name extracted from resume",
  "email": "Email from resume or empty string",
  "role": "The primary job title or target role",
  "score": <integer 0-100, honest ATS/quality score>,
  "domain": "Classified domain name",
  "domainConfidence": "high" | "low",
  "detectedDomains": [
    {
      "domain": "Domain Name",
      "confidence": <integer 0-100>
    }
  ],
  "domainWhy": ["Reason 1", "Reason 2", ...],
  "strengths": ["Strength 1", "Strength 2", ...],
  "skills": ["skill1", "skill2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "categoryScores": {
    "technicalSkills": <integer 0-100>,
    "experience": <integer 0-100>,
    "education": <integer 0-100>,
    "atsKeywords": <integer 0-100>,
    "formatting": <integer 0-100>,
    "completeness": <integer 0-100>
  },
  "scoreBreakdown": [
    {
      "category": "Category Name",
      "score": <integer 0-100>,
      "weight": <integer 0-100 representing contribution percentage to the total final score>,
      "explanation": "Short AI explanation (1-2 sentences) of how this category was evaluated.",
      "suggestion": "Recommendation string if score < 75, or null if score >= 75"
    }
  ],
  "suggestions": [
    {
      "id": 1,
      "title": "Short actionable suggestion title",
      "description": "Detailed explanation of the suggestion.",
      "impact": "High" | "Medium" | "Low",
      "reason": "Why the issue was detected",
      "improvements": "Specific improvement points or step-by-step suggestions",
      "originalSection": "The exact or representative section of the resume affected by the issue",
      "improvedSection": "Draft of how the section should read after applying the suggestion"
    }
  ]
}

Rules:
- "domain": Classify the resume into exactly one of these domains: Software Engineering, Data Science / AI, Cybersecurity, DevOps, UI/UX Design, Business Analyst, Marketing, Sales, Human Resources, Finance, Accounting, Mechanical Engineering, Civil Engineering, Electrical Engineering, Healthcare, Education, Legal, Operations, Other. If the resume spans multiple domains (e.g. Project Management + Software Engineering), return a combined category (e.g., 'Project Management & Software Engineering') and combine the relevant breakdown categories intelligently. If domain confidence is low, return EXACTLY 'General Professional'.
- "domainConfidence": Set to 'high' or 'low'. If 'low', the domain must be 'General Professional'.
- "detectedDomains": Provide an array of objects representing detected domains sorted in descending order of confidence. Each object has keys "domain" (a string naming the career domain) and "confidence" (an integer 0-100). If the resume is multi-disciplinary, include up to 2 domains (primary and secondary). Otherwise return exactly 1 domain in the array. Important rule: If the primary classification's confidence is below 70, you MUST return exactly one domain in the array: {"domain": "General Professional", "confidence": <detected score>}, and then generate generic recommendations instead of domain-specific/technical advice.
- "domainWhy": Provide between 3 and 5 clear, brief reasons (bullet points) why this domain classification was selected. Base each reason on elements actually found in the resume text (e.g., specific languages, roles, certs, or projects).
- "strengths": Provide between 3 and 5 positive findings (bullet points) extracted specifically from this resume such as strong leadership, excellent projects, good formatting, or quantified achievements. Never use fixed/canned strengths.
- "categoryScores": Provide scores between 0 and 100 for each of the keys: "technicalSkills", "experience", "education", "atsKeywords", "formatting", "completeness". Specifically:
  * "technicalSkills": Evaluation of candidate's technical skills profile.
  * "experience": Evaluation of candidate's work history and achievements.
  * "education": Evaluation of candidate's academic background and certifications.
  * "atsKeywords": Evaluation of candidate's key terms alignment.
  * "formatting": Evaluation of resume formatting, layout, alignment, and parser readability.
  * "completeness": Evaluation of essential candidate contact profile sections matching.
  * Mathematical constraint: The overall "score" of the resume MUST equal: (technicalSkills * 0.25) + (experience * 0.25) + (education * 0.15) + (atsKeywords * 0.15) + (formatting * 0.15) + (completeness * 0.05). Make sure the math is exactly correct, and round the sum to the nearest integer.
- "scoreBreakdown": Generate a list of category evaluations based on the detected domain. Do NOT use hardcoded fixed categories. Provide between 4 and 6 categories relevant to the career domain. For example:
  * Software Engineering: Technical Skills, Projects, Programming Languages, ATS Keywords, Experience, Formatting.
  * Marketing: Marketing Skills, Campaign Experience, Analytics Tools, Communication, ATS Keywords, Formatting.
  * Human Resources: Recruitment Experience, HR Skills, Communication, Certifications, ATS Keywords, Formatting.
  * Mechanical Engineering: Technical Skills, CAD/Design Experience, Manufacturing Experience, Projects, ATS Keywords, Formatting.
  * If the domain is 'General Professional', use exactly these 6 categories: Skills, Experience, Education, ATS Keywords, Formatting, Overall Resume Quality.
- Mathematical constraints for "scoreBreakdown":
  * The sum of category weights MUST equal exactly 100.
  * The overall "score" of the resume MUST equal the sum of (category["score"] * category["weight"] / 100).
- "skills", "missingKeywords", "suggestions", "scoreBreakdown": MUST be strictly relevant to the detected domain. Never display irrelevant advice (e.g., do NOT suggest programming keywords/skills for HR; do NOT suggest recruitment keywords/skills for Software Engineering; do NOT evaluate AutoCAD for Marketing).
- "skills": list up to 12 technical/soft skills you found in the resume.
- "missingKeywords": list 4-7 important keywords/skills relevant to the role that are MISSING from the resume.
- "suggestions": provide exactly 3 suggestions ranked by impact (High first).
- "score": be honest. A weak resume should score 40-60. A strong one 75-90.
- Return ONLY the JSON object, no markdown fences, no explanation.

Resume Text:
---
${resumeText.slice(0, 8000)}
---`;

    let response;
    if (isOpenRouter) {
        response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'RESUAI'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.5-flash',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2000,
                    response_format: {
                        type: 'json_object'
                    }
                }),
            }
        );
    } else {
        response = await fetch(
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
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = isOpenRouter
            ? (err?.error?.message || `OpenRouter API error: ${response.status}`)
            : (err?.error?.message || `Gemini API error: ${response.status}`);
        throw new Error(message);
    }

    const data = await response.json();
    let rawText;
    if (isOpenRouter) {
        rawText = data?.choices?.[0]?.message?.content;
    } else {
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!rawText) {
        throw new Error(isOpenRouter ? 'No response from OpenRouter.' : 'No response from Gemini API.');
    }

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
    return JSON.parse(cleaned);
}

export async function refineResume(originalText, appliedSuggestions) {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const apiKey = openRouterKey || geminiKey;

    if (!apiKey) {
        throw new Error('Missing API key in .env file.');
    }

    const isOpenRouter = apiKey.startsWith('sk-or-');
    
    const prompt = `You are a professional resume writer and career coach. Your task is to rewrite a resume by applying a list of chosen improvements/suggestions.
    
Original Resume Text:
---
${originalText}
---

Improvements/Suggestions to Apply:
${appliedSuggestions.map((s, idx) => `
Suggestion ${idx + 1}: ${s.title}
- Original version to replace/enrich: ${s.originalSection}
- Improved draft/feedback: ${s.improvedSection}
`).join('\n')}

Rewrite the entire resume to incorporate these improvements. Keep all other sections matching the original resume structure (e.g. Contact, other jobs, education). Ensure the tone is professional, achievement-oriented, and ATS-optimized.
Return ONLY the complete, newly refined resume text. Do not add any conversational text, markdown formatting blocks (like \`\`\`text), or introductory/concluding explanations.`;

    let response;
    if (isOpenRouter) {
        response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'RESUAI'
                },
                body: JSON.stringify({
                    model: 'google/gemini-2.5-flash',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 2500
                }),
            }
        );
    } else {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        temperature: 0.3
                    },
                }),
            }
        );
    }

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const message = isOpenRouter
            ? (err?.error?.message || `OpenRouter API error: ${response.status}`)
            : (err?.error?.message || `Gemini API error: ${response.status}`);
        throw new Error(message);
    }

    const data = await response.json();
    let rawText;
    if (isOpenRouter) {
        rawText = data?.choices?.[0]?.message?.content;
    } else {
        rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    if (!rawText) {
        throw new Error('No response from AI writing service.');
    }

    return rawText.replace(/^```[a-zA-Z]*\s*|```\s*$/g, '').trim();
}

