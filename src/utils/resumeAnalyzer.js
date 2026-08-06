/* global process */
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
 * Detect free-tier errors like credit limits, token limits, and rate limits
 */
export function isFreeTierError(status, errorMessage) {
    const msg = (errorMessage || '').toLowerCase();
    return status === 402 || 
           status === 429 || 
           msg.includes('insufficient credits') || 
           msg.includes('credits') || 
           msg.includes('max_tokens') || 
           msg.includes('fewer max_tokens') || 
           msg.includes('payment required') || 
           msg.includes('rate limit') ||
           msg.includes('too many requests');
}

const MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS || 500);

/**
 * Analyzes resume text using either the OpenRouter API or Gemini API and returns structured JSON results.
 */
export async function analyzeResume(resumeText) {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    const apiKey = openRouterKey || geminiKey;

    if (!apiKey) {
        throw new Error('AI analysis is temporarily unavailable. Please check API credits or try again later.');
    }

    const isOpenRouter = apiKey.startsWith('sk-or-');

    // Requirement 8: Validate model and fall back to free model if paid
    let modelName = process.env.OPENROUTER_MODEL || 'openrouter/free';
    if (isOpenRouter && !modelName.endsWith(':free') && modelName !== 'openrouter/free') {
        console.warn(`[OpenRouter] Configured model "${modelName}" is paid. Switching to free-tier model.`);
        modelName = 'openrouter/free';
    }

    const prompt = `You are a resume parser. Analyze this resume text and return a valid JSON object.
CRITICAL: To fit within tight free-tier token limits (500 tokens max), you MUST write extremely short text values:
- Keep domainWhy and strengths list items under 4 words each.
- Keep scoreBreakdown explanation and suggestion under 5 words each.
- Keep suggestions title, description, reason, improvements, originalSection, and improvedSection under 5 words each.
Failure to keep strings short will result in truncation! Output MUST be under 400 response tokens.

JSON Structure:
{
  "name": "Full name",
  "email": "Email or empty string",
  "role": "Primary job title",
  "score": <integer 0-100>,
  "domain": "Domain Name",
  "domainConfidence": "high" | "low",
  "detectedDomains": [{"domain": "Domain Name", "confidence": <0-100>}],
  "domainWhy": ["Reason 1", "Reason 2"],
  "strengths": ["Strength 1", "Strength 2"],
  "skills": ["Skill1", "Skill2"],
  "missingKeywords": ["Keyword1", "Keyword2"],
  "categoryScores": {
    "technicalSkills": <0-100>,
    "experience": <0-100>,
    "education": <0-100>,
    "atsKeywords": <0-100>,
    "formatting": <0-100>,
    "completeness": <0-150>
  },
  "scoreBreakdown": [
    {
      "category": "Category Name",
      "score": <0-100>,
      "weight": <0-100 (sum must be 100)>,
      "explanation": "Short sentence.",
      "suggestion": "Short recommendation or null"
    }
  ],
  "suggestions": [
    {
      "id": 1,
      "title": "Short title",
      "description": "Short description.",
      "impact": "High" | "Medium" | "Low",
      "reason": "Why detected",
      "improvements": "Improvement points",
      "originalSection": "Original section",
      "improvedSection": "Draft text"
    }
  ]
}

Constraints:
1. domainConfidence: Set to 'high' or 'low'. If 'low', the domain must be 'General Professional'.
2. detectedDomains: Max 2 domains sorted desc. If primary classification confidence < 70, return exactly one: {"domain": "General Professional", "confidence": <score>}.
3. categoryScores: overall "score" must equal round(technicalSkills*0.25 + experience*0.25 + education*0.15 + atsKeywords*0.15 + formatting*0.15 + completeness*0.05).
4. scoreBreakdown: 4 to 6 categories. Weights sum to 100. overall "score" must equal sum of (category.score * category.weight / 100).
5. suggestions: exactly 3 suggestions ranked by impact (High first).
6. Output ONLY raw JSON. No markdown wrappers.

Resume Text:
---
${resumeText.slice(0, 4000)}
---`;

    let currentMaxTokens = MAX_TOKENS;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            // Dynamically compress output expectations on 400 max_tokens retry
            let dynamicPrompt = prompt;
            if (isOpenRouter && currentMaxTokens === 400) {
                dynamicPrompt += `\nCRITICAL: You MUST keep ALL text fields (like explanation, description, reason, suggestions, originalSection, improvedSection) under 3 words each because output token limit is VERY restricted! Return the JSON in the most minimal skeletal shape possible.`;
            }

            // Requirement 5: Log (development only) model name, max_tokens, key source
            if (import.meta.env.DEV && isOpenRouter) {
                console.group('%c[OpenRouter Request Diagnostics]', 'color: #3b82f6; font-weight: bold;');
                console.log(`Model name: ${modelName}`);
                console.log(`max_tokens: ${currentMaxTokens}`);
                console.log(`API Key source: ${process.env.OPENROUTER_API_KEY ? 'Environment Variable (process.env)' : 'Vite Env'}`);
                console.groupEnd();
            }

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
                            model: modelName,
                            messages: [
                                {
                                    role: 'user',
                                    content: dynamicPrompt
                                }
                            ],
                            temperature: 0.3,
                            max_tokens: currentMaxTokens,
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
                            contents: [{ parts: [{ text: dynamicPrompt }] }],
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
                const message = err?.error?.message || `API error: ${response.status}`;

                // Requirement 5: Log developer error details
                if (import.meta.env.DEV && isOpenRouter) {
                    console.group('%c[OpenRouter Error Diagnostics]', 'color: #ef4444; font-weight: bold;');
                    console.log(`HTTP Status: ${response.status}`);
                    console.log(`Error Response:`, err);
                    console.groupEnd();
                }

                if (isOpenRouter && isFreeTierError(response.status, message)) {
                    if (attempts < maxAttempts) {
                        console.warn(`[OpenRouter] Free-tier limit error (status ${response.status}): "${message}". Retrying once with max_tokens=400...`);
                        currentMaxTokens = 400;
                        continue;
                    } else {
                        console.error('[OpenRouter] Free-tier limit error. No retries left.');
                        return {
                            success: false,
                            error: "AI analysis is temporarily unavailable. Please check API credits or try again later."
                        };
                    }
                }
                throw new Error(message);
            }

            const data = await response.json();
            
            // Log tokens in development mode
            if (import.meta.env.DEV && isOpenRouter) {
                const usage = data?.usage;
                if (usage) {
                    console.group('%c[OpenRouter Token Usage]', 'color: #8b5cf6; font-weight: bold;');
                    console.log(`Input Tokens:  ${usage.prompt_tokens ?? 'N/A'}`);
                    console.log(`Output Tokens: ${usage.completion_tokens ?? 'N/A'}`);
                    console.log(`Total Tokens:  ${usage.total_tokens ?? 'N/A'}`);
                    console.groupEnd();
                }
            }

            let rawText;
            if (isOpenRouter) {
                if (data?.choices?.[0]?.finish_reason === 'length') {
                    throw new SyntaxError('OpenRouter response truncated due to output limit.');
                }
                rawText = data?.choices?.[0]?.message?.content;
            } else {
                rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            }

            if (!rawText) {
                throw new Error(isOpenRouter ? 'No response from OpenRouter.' : 'No response from Gemini API.');
            }

            const cleaned = rawText.replace(/^```json\s*|```\s*$/g, '').trim();
            try {
                return JSON.parse(cleaned);
            } catch (jsonErr) {
                console.error("[OpenRouter] JSON parsing failed, likely truncated", jsonErr);
                throw jsonErr; // handled by retry catch block
            }

        } catch (err) {
            const status = err.status || 0;
            const message = err.message || '';
            
            // Requirement 5: Log developer error details
            if (import.meta.env.DEV && isOpenRouter) {
                console.group('%c[OpenRouter Error Diagnostics - Catch Block]', 'color: #ef4444; font-weight: bold;');
                console.log(`Error Name: ${err.name}`);
                console.log(`Error Message: ${err.message}`);
                console.log(`Raw Error Object:`, err);
                console.groupEnd();
            }

            const isTruncationOrFreeTier = isFreeTierError(status, message) || 
                                           err instanceof SyntaxError || 
                                           err.name === 'SyntaxError' || 
                                           message.includes('truncated');
            
            if (isOpenRouter && isTruncationOrFreeTier) {
                if (attempts < maxAttempts) {
                    console.warn(`[OpenRouter] Call failed: "${message}". Retrying once with max_tokens=400...`);
                    currentMaxTokens = 400;
                    continue;
                } else {
                    return {
                        success: false,
                        error: "AI analysis is temporarily unavailable. Please check API credits or try again later."
                    };
                }
            }
            throw new Error("AI analysis is temporarily unavailable. Please check API credits or try again later.");
        }
    }
}

export async function refineResume(originalText, appliedSuggestions) {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY;
    const apiKey = openRouterKey || geminiKey;

    if (!apiKey) {
        throw new Error('AI analysis is temporarily unavailable. Please check API credits or try again later.');
    }

    const isOpenRouter = apiKey.startsWith('sk-or-');
    
    // Requirement 8: Validate model and fall back to free model if paid
    let modelName = process.env.OPENROUTER_MODEL || 'openrouter/free';
    if (isOpenRouter && !modelName.endsWith(':free') && modelName !== 'openrouter/free') {
        console.warn(`[OpenRouter Refinement] Configured model "${modelName}" is paid. Switching to free-tier model.`);
        modelName = 'openrouter/free';
    }

    const prompt = `You are a professional resume writer. Rewrite this resume applying these improvements:
Original Resume:
---
${originalText}
---

Improvements to Apply:
${appliedSuggestions.map((s, idx) => `
Suggestion ${idx + 1}: ${s.title}
- Original version to replace: ${s.originalSection}
- Improved draft/feedback: ${s.improvedSection}
`).join('\n')}

Rewrite the entire resume to incorporate these improvements. Keep all other sections matching the original resume structure (e.g. Contact, other jobs, education). Ensure the tone is professional, achievement-oriented, and ATS-optimized. Keep length compact.
Return ONLY the complete, newly refined resume text. Do not add any conversational text, markdown formatting blocks (like \`\`\`text), or introductory/concluding explanations.`;

    let currentMaxTokens = MAX_TOKENS;
    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            // Requirement 5: Log (development only) model name, max_tokens, key source
            if (import.meta.env.DEV && isOpenRouter) {
                console.group('%c[OpenRouter Refinement Request Diagnostics]', 'color: #3b82f6; font-weight: bold;');
                console.log(`Model name: ${modelName}`);
                console.log(`max_tokens: ${currentMaxTokens}`);
                console.log(`API Key source: ${process.env.OPENROUTER_API_KEY ? 'Environment Variable (process.env)' : 'Vite Env'}`);
                console.groupEnd();
            }

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
                            model: modelName,
                            messages: [
                                {
                                    role: 'user',
                                    content: prompt
                                }
                            ],
                            temperature: 0.3,
                            max_tokens: currentMaxTokens
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
                const message = err?.error?.message || `API error: ${response.status}`;

                // Requirement 5: Log developer error details
                if (import.meta.env.DEV && isOpenRouter) {
                    console.group('%c[OpenRouter Refinement Error Diagnostics]', 'color: #ef4444; font-weight: bold;');
                    console.log(`HTTP Status: ${response.status}`);
                    console.log(`Error Response:`, err);
                    console.groupEnd();
                }

                if (isOpenRouter && isFreeTierError(response.status, message)) {
                    if (attempts < maxAttempts) {
                        console.warn(`[OpenRouter Refinement] Free-tier limit error (status ${response.status}): "${message}". Retrying once with max_tokens=400...`);
                        currentMaxTokens = 400;
                        continue;
                    } else {
                        throw new Error("AI analysis is temporarily unavailable. Please check API credits or try again later.");
                    }
                }
                throw new Error(message);
            }

            const data = await response.json();
            
            // Log tokens in development mode
            if (import.meta.env.DEV && isOpenRouter) {
                const usage = data?.usage;
                if (usage) {
                    console.group('%c[OpenRouter Token Usage - Refine]', 'color: #8b5cf6; font-weight: bold;');
                    console.log(`Input Tokens:  ${usage.prompt_tokens ?? 'N/A'}`);
                    console.log(`Output Tokens: ${usage.completion_tokens ?? 'N/A'}`);
                    console.log(`Total Tokens:  ${usage.total_tokens ?? 'N/A'}`);
                    console.groupEnd();
                }
            }

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

        } catch (err) {
            const status = err.status || 0;
            const message = err.message || '';

            // Requirement 5: Log developer error details
            if (import.meta.env.DEV && isOpenRouter) {
                console.group('%c[OpenRouter Refinement Error Diagnostics - Catch Block]', 'color: #ef4444; font-weight: bold;');
                console.log(`Error Name: ${err.name}`);
                console.log(`Error Message: ${err.message}`);
                console.log(`Raw Error Object:`, err);
                console.groupEnd();
            }

            if (isOpenRouter && isFreeTierError(status, message)) {
                if (attempts < maxAttempts) {
                    console.warn(`[OpenRouter Refinement] Call failed: "${message}". Retrying once with max_tokens=400...`);
                    currentMaxTokens = 400;
                    continue;
                } else {
                    throw new Error("AI analysis is temporarily unavailable. Please check API credits or try again later.");
                }
            }
            throw new Error("AI analysis is temporarily unavailable. Please check API credits or try again later.");
        }
    }
}

