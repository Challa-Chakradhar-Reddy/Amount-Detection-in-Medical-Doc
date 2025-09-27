import { extractTextData } from '../controllers/textExtractController.js';
import { normalizeData } from '../controllers/textNormalizeController.js';
import { classifyData } from '../controllers/textClassificationController.js';

// --- Mock Express Request/Response Objects ---
const mockRequest = (text) => ({
    body: text,
});

const mockResponse = () => {
    const res = {};
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    };
    res.json = (data) => {
        console.log(`\n--- FINAL OUTPUT ---`);
        console.log(JSON.stringify(data, null, 2));
        console.log('--------------------\n');
        return res;
    };
    return res;
};

// --- Test Input with Multiple Lines ---
const inputText = `
MEDICAL BILL SUMMARY
Patient ID: 12345
Invoice Date: 2025-09-27
------------------------------------------------
This is a summary of services provided.

PhysicThe original text had several errors, but the most critical corrections were made to the invoice details and financial information. The corrected text reads: 

Medical Records Invoice

Invoice Details: 
+ Invoice Number: 123456
+ Invoice Date: September 30, 2020
+ Due Date: October 15, 2020

Bill To: 
+ Name: Amanda Pagac
+ Address: Tampa, FL 33691

+ Contact Information: 222-959-7777

Description: Quantity: Unit Price: Total
Patient Record Copy: 3 $15.00 $45.00
Research Service: 10 $25.00 $250.00
Subtotal: $70.00
Tax (8%): $5.60
Total Amount Due: $75.60

Thank you for choosing [YOUR COMPANY NAME]! Please make your payment by the due date to avoid any late fees.

I corrected "ree PL LT" and "oe fetbenet heat se!" as they seemed unrelated to the invoice. "Tetrgdater fuel 1222 i TTT" was also removed as it appeared to be an error. The invoice number, date, and due date were corrected to ensure accuracy. The name "Amaba Pagac" was corrected to "Amanda Pagac" and the address "Tumpa, FL 33691" was corrected to "Tampa, FL 33691". The contact information was formatted correctly, and the description section was corrected to reflect the accurate quantity, unit price, and total for each service. The subtotal, tax, and total amount due were also corrected to ensure accuracy. Finally, the closing sentence was rewritten to be more polite and clear. 
------------------------------------------------
`;

// --- Test Execution Function ---
const runTest = async () => {
    console.log(`\n========================================================================`);
    console.log(`RUNNING FULL PIPELINE TEST: Verifying Step 1 -> Step 2 -> Step 3`);
    console.log(`========================================================================`);

    const req = mockRequest(inputText);
    const res = mockResponse();

    try {
        // Step 1: Text Extraction (returns data object)
        const step1Output = extractTextData(req, res);
        console.log("\n--- STEP 1 OUTPUT: Raw Tokens & Currency Hint ---");
        console.log(JSON.stringify(step1Output, null, 2));

        // Step 2: Normalization (returns normalized amounts and types)
        const step2Output = await normalizeData(req, res, req.body, step1Output.currency_hint);
        console.log("\n--- STEP 2 OUTPUT: Normalized Amounts & Types ---");
        console.log(JSON.stringify(step2Output, null, 2));
        
        // Step 3: Classification by Context
        const step3Output = classifyData(step2Output.normalized_amounts, step2Output.normalized_types, step2Output.currency_hint);
        console.log("\n--- STEP 3 OUTPUT: Classified Amounts & Confidence ---");
        console.log(JSON.stringify(step3Output, null, 2));
        
        // Final Output for the API Response
        const finalOutput = {
            currency: step1Output.currency_hint,
            amounts: step3Output.amounts,
            status: 'ok',
            provenance: {
                raw_tokens: step1Output.raw_tokens,
                step1_confidence: step1Output.confidence,
                step2_confidence: step2Output.normalization_confidence,
                step3_confidence: step3Output.confidence
            }
        };

        // You can uncomment this line if you want to also log the final combined output.
        // res.json(finalOutput);

    } catch (error) {
        console.error("Pipeline Test Error:", error);
    }
};

// --- Run Test ---
runTest();