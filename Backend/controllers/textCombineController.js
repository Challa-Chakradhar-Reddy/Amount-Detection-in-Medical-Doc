// import { extractTextData } from './textExtractController.js';
// import { normalizeData } from './textNormalizeController.js';
// import { classifyData } from './textClassificationController.js';

// export const processTextPipeline = async (req, res) => {
//     try {
//         // Step 1: Text Extraction (returns data object)
//         const step1Output = extractTextData(req, res);

//         // Guardrail / Exit Condition for text input
//         if (step1Output.status === 'no_amounts_found') {
//             return res.status(400).json(step1Output);
//         }

//         // Step 2: Normalization (returns normalized amounts and types)
//         const step2Output = await normalizeData(req, res, req.body, step1Output.currency_hint);
        
//         // Step 3: Classification by Context
//         const step3Output = classifyData(step2Output.normalized_amounts, step2Output.normalized_types, step2Output.currency_hint);
        
//         // Final Output for the API Response
//         const finalOutput = {
//             currency: step1Output.currency_hint,
//             amounts: step3Output.amounts,
//             status: 'ok',
//             provenance: {
//                 raw_tokens: step1Output.raw_tokens,
//                 step1_confidence: step1Output.confidence,
//                 step2_confidence: step2Output.normalization_confidence,
//                 step3_confidence: step3Output.confidence
//             }
//         };

//         return res.status(200).json(finalOutput);

//     } catch (error) {
//         return res.status(500).json({ status: 'error', reason: 'Internal server error during processing.' });
//     }
// };



// import { extractTextData } from './textExtractController.js';
// import { normalizeData } from './textNormalizeController.js';
// import { classifyData } from './textClassificationController.js';

// export const processTextPipeline = async (req, res) => {
//     try {
//         // Step 1: Text Extraction (returns data object)
//         const step1Output = extractTextData(req, res);
//         console.log("--- STEP 1 OUTPUT ---");
//         console.log(JSON.stringify(step1Output, null, 2));
//         console.log("----------------------");

//         // Guardrail / Exit Condition for text input
//         if (step1Output.status === 'no_amounts_found') {
//             return res.status(400).json(step1Output);
//         }

//         // Step 2: Normalization (returns normalized amounts and types)
//         const step2Output = await normalizeData(req, res, req.body, step1Output.currency_hint);
//         console.log("\n--- STEP 2 OUTPUT ---");
//         console.log(JSON.stringify(step2Output, null, 2));
//         console.log("----------------------");
        
//         // Step 3: Classification by Context
//         const step3Output = classifyData(step2Output.normalized_amounts, step2Output.normalized_types, step2Output.currency_hint);
//         console.log("\n--- STEP 3 OUTPUT ---");
//         console.log(JSON.stringify(step3Output, null, 2));
//         console.log("----------------------\n");
        
//         // Final Output for the API Response
//         const finalOutput = {
//             currency: step1Output.currency_hint,
//             amounts: step3Output.amounts,
//             status: 'ok',
//             provenance: {
//                 raw_tokens: step1Output.raw_tokens,
//                 step1_confidence: step1Output.confidence,
//                 step2_confidence: step2Output.normalization_confidence,
//                 step3_confidence: step3Output.confidence
//             }
//         };

//         return res.status(200).json(finalOutput);

//     } catch (error) {
//         return res.status(500).json({ status: 'error', reason: 'Internal server error during processing.' });
//     }
// };


import { extractTextData } from './textExtractController.js';
import { normalizeData } from './textNormalizeController.js';
import { classifyData } from './textClassificationController.js';

export const processTextPipeline = async (req, res) => {
    try {
        // Step 1: Text Extraction (returns data object)
        const step1Output = extractTextData(req, res);

        // Guardrail / Exit Condition for text input
        if (step1Output.status === 'no_amounts_found') {
            return res.status(400).json(step1Output);
        }

        // Step 2: Normalization (returns normalized amounts and types)
        // Passes req.body (original text) to normalizeData
        const step2Output = await normalizeData(req, res, req.body, step1Output.currency_hint);
        
        // Step 3: Classification by Context
        // Passes normalized data and the original text for PROVENANCE CONSTRUCTION
        const step3Output = classifyData(step2Output.normalized_amounts, step2Output.normalized_types,step1Output.currency_hint, req.body);
       
        // Final Output (Step 4 Format)
        const finalOutput = {
            currency: step1Output.currency_hint,
            amounts: step3Output.amounts, // This array now includes the 'source' field
            status: 'ok',
            provenance: {
                raw_tokens: step1Output.raw_tokens,
                step1_confidence: step1Output.confidence,
                step2_confidence: step2Output.normalization_confidence,
                step3_confidence: step3Output.confidence
            }
        };

        return res.status(200).json(finalOutput);

    } catch (error) {
        // Console logging remains in catch blocks for critical runtime error debugging
        return res.status(500).json({ status: 'error', reason: 'Internal server error during processing.' });
    }
};


