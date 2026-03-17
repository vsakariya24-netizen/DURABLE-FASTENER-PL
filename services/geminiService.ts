// geminiService.ts — Free Gemini 1.5 Flash API
// Get your FREE key at: https://aistudio.google.com/app/apikey

export interface RecommendationResult {
  productId: string;
  matchScore: number;
  rationale: string;
}

export async function getProductRecommendations(
  query: string,
  products: { id: string; name: string; category: string; description?: string; tags?: string[] }[]
): Promise<RecommendationResult[]> {

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in your .env file');
  }

  const productCatalog = products.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description || '',
    tags: p.tags || [],
  }));

  const prompt = `You are a precise industrial fastener expert for CLASSONE — a professional fastener export company.

Given the user's project requirement, find the best matching products from the catalog below.

STRICT RULES:
- Return ONLY a raw JSON array. No markdown, no explanation, no backticks.
- Each object must have exactly: { "productId": string, "matchScore": number, "rationale": string }
- matchScore: integer between 50 and 99 (higher = better match)
- rationale: 1 to 2 sentences explaining WHY this product fits the user's specific need
- Only include products with matchScore >= 55
- Sort by matchScore descending
- Maximum 4 results
- If nothing matches well, return: []

Product catalog:
${JSON.stringify(productCatalog)}

User requirement: ${query}`;

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,       // low = more precise, consistent
            maxOutputTokens: 1024,
          },
        }),
      }
    );
  } catch (networkError) {
    console.error('Network error calling Gemini:', networkError);
    throw new Error('Network error — check your internet connection.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API failed: ${response.status}`);
  }

  const data = await response.json();

  // Extract text from Gemini response structure
  const text: string =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

  console.log('Gemini raw response:', text); // helpful for debugging

  // Remove any accidental backticks or markdown
  const cleaned = text.replace(/```json|```/gi, '').trim();

  let parsed: RecommendationResult[];
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', cleaned);
    throw new Error('Gemini returned an unexpected format.');
  }

  return Array.isArray(parsed) ? parsed : [];
}