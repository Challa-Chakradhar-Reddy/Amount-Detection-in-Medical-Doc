import { 
    calculateTokenConfidence,
    calculateFinalConfidence 
} from '../utils/confidence.js';

const extractRawTokens = (text) => {
    const regex = /\b(?:\d[\d,.]*(?:%|\b))/g;
    const matches = text.match(regex) || [];
    return matches.map(token => token.replace(/,/g, ''));
};

const checkCurrencyAndBoost = (text) => {
    const currencyMap = {
        'INR': ['inr', 'rs.', 'rs', 'rupees','Rs','Rs.','INR','RUPEE','rupee','RUPEES'],
        'USD': ['usd', '$'],
        'EUR': ['eur', '€'],
    };
    
    const lowercaseText = text.toLowerCase();
    let currencyHint = null;
    let currencyBoost = 0;

    for (const currencyCode in currencyMap) {
        if (currencyMap[currencyCode].some(symbol => lowercaseText.includes(symbol))) {
            currencyHint = currencyCode;
            currencyBoost = 0.2; 
            break;
        }
    }
    
    return { currency: currencyHint, boost: currencyBoost };
};

export const extractTextData = (req, res) => {
    const text = req.body;
    
    if (!text || typeof text !== 'string' || text.trim().length < 5) {
        return {
            "status": "no_amounts_found",
            "reason": "document too noisy or empty"
        };
    }

    const rawTokens = extractRawTokens(text);
    const { currency: currencyHint, boost: currencyBoost } = checkCurrencyAndBoost(text);
    const tokenConfidence = calculateTokenConfidence(rawTokens.length);
    const finalConfidence = calculateFinalConfidence(tokenConfidence, currencyBoost);

    const output = {
        "raw_tokens": rawTokens,
        "currency_hint": currencyHint,
        "confidence": rawTokens.length > 0 ? finalConfidence : 0, 
        "status": "ok"
    };

    // The function now returns the output object, instead of sending a response.
    return output;
};