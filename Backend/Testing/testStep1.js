import { extractTextData } from '../controllers/textExtractController.js';

// --- Mock Input Data ---
// Sample input text mimicking a raw receipt scan (similar to Step 1 problem statement)
const inputText = "Total: INR 1200 | Paid: 1000 | Due: 200 | Discount: 10%";
const ocrSample = "T0tal: Rs l200 | Pald: 1000 | Due: 200";

// --- Mock Express Request/Response Objects ---
// In a real Express pipeline, req.body holds the text, and res.json() sends the output.

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
        res.body = data;
        // Log the output clearly so you can check it manually
        console.log(`\n--- Test Status: ${res.statusCode} ---`);
        console.log(JSON.stringify(res.body, null, 2));
        console.log('----------------------------------\n');
        return res;
    };
    return res;
};

// --- Test Execution Function ---
const runTest = (name, input) => {
    console.log(`\n======================================================`);
    console.log(`RUNNING TEST: ${name}`);
    console.log(`Input Text: "${input}"`);
    console.log(`======================================================`);

    const req = mockRequest(input);
    const res = mockResponse();

    // Call the controller directly
    extractTextData(req, res);
};

// --- Run Tests ---
// Test 1: Clean Input (Should find all tokens and currency)
runTest("Clean Financial Text Input", inputText);

// Test 2: OCR-like Noisy Input (Should still find amounts and currency hint)
runTest("Noisy OCR Text Input", ocrSample);

// Test 3: Noisy/Empty Input (Should trigger the Guardrail)
runTest("Guardrail Test (Too short/Noisy)", "Just some random words.");