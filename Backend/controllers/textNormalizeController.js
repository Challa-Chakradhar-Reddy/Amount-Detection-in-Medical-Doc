import { OpenAI } from 'openai';
import { VarEnv } from '../configurations/VarEnv.js';

const openai = new OpenAI({
    apiKey: VarEnv.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

const groqBasedCorrection = async (text) => {
    try {
        const prompt = `You are a text normalization and data extraction expert. Correct any OCR-like errors in the following text. Then, extract all corrected numeric amounts and their corresponding labels (e.g., 'total', 'paid', 'due', 'discount') and return them as a clean JSON object.Also you can remove discount component.

Original text: "${text}"

Example of desired JSON output for "Total: Rs l200 | Pald: 1000 | Discount: 10%":
{
    "normalized_data": [
        {"type": "total", "value": 1200},
        {"type": "paid", "value": 1000},
        {"type": "discount", "value": "10%"}
    ]
}`;

        const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are an expert at correcting text and extracting structured data." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        });

        const groqOutput = JSON.parse(response.choices?.[0]?.message?.content || '{}');
        return groqOutput;

    } catch (error) {
        console.error("Groq API Error:", error.message);
        return null;
    }
};

export const normalizeData = async (req, res, originalText, currencyHint) => {
    const groqOutput = await groqBasedCorrection(originalText);

    const normalizationConfidence = groqOutput && groqOutput.normalized_data?.length > 0 ? 0.95 : 0.40;
    
    // We create the two separate lists from the Groq output for later steps.
    const normalizedAmounts = groqOutput?.normalized_data?.map(item => item.value) || [];
    const normalizedTypes = groqOutput?.normalized_data?.map(item => item.type) || [];

    return {
        normalized_amounts: normalizedAmounts,
        normalized_types: normalizedTypes, // Added for later use
        normalization_confidence: parseFloat(normalizationConfidence.toFixed(2)),
        currency_hint: currencyHint
    };
};