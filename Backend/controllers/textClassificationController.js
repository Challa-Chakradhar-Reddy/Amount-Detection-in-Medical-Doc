import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const classifyData = (normalizedAmounts, normalizedTypes, currencyHint) => {
    const amounts = [];
    const classificationConfidence = 0.80;

    for (let i = 0; i < normalizedAmounts.length; i++) {
        const type1 = normalizedTypes[i];
        const value = normalizedAmounts[i];

        // The problem statement shows that `discount` is not in the final output
        if (type1.toLowerCase() !== 'discount') {
            amounts.push({
                type: type1, // Use the type directly from the normalization step
                value: value,
                typee: `${currencyHint} ${value}`,
            });
        }
    }

    return {
        amounts,
        confidence: classificationConfidence,
    };
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

