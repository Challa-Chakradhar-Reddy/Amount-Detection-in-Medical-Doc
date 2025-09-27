/**
 * Calculates a confidence score based on the number of extracted tokens (numeric values).
 * This function handles the baseline and token-count contribution to the final score.
 * *@param {number} tokenCount The number of raw tokens found.
 * @returns {number} The base confidence score (0.0 to 0.7).
 */
export const calculateTokenConfidence = (tokenCount) => {
    // Returns 0 if no tokens are found
    if (tokenCount === 0) return 0;
    
    // Max of 3 tokens contribute to the additive score (0.1 each)
    const maxTokens = 3;
    const additiveScore = Math.min(tokenCount, maxTokens) * 0.1;
    
    // Base confidence starts at 0.4
    const baseConfidence = 0.4;
    return Math.min(baseConfidence + additiveScore, 0.7);
};

/**
 * Calculates the final, aggregated confidence score.
 * * @param {number} tokenConfidence Confidence from token presence (0.0 to 0.7).
 * @param {number} currencyBoost The confidence boost from finding a currency hint (e.g., 0.2).
 * @returns {number} The final confidence score, capped at 1.0.
 */
export const calculateFinalConfidence = (tokenConfidence, currencyBoost) => {
    // Combine the scores, ensuring the final result is capped at 1.0
    return parseFloat(Math.min(tokenConfidence + currencyBoost, 1.0).toFixed(2));
};