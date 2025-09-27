import { normalizeData } from '../controllers/textNormalizeController.js';

// --- Mock Input Data in a Natural Language Paragraph ---
const inputText = `
This is a summary of the medical services provided to the patient on a recent visit. The report is for insurance purposes. Please see the financial breakdown below.

Total: l200 INR
Paid by cash: lo0
Paiid by card: 9O0
Due: 2oo
Discount: 1O%
Balance remaining: 500

Thank you for your visit.
`;

// --- Mock Express Request/Response Objects (async) ---
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
        console.log(`\n--- Test Status: 200 OK ---`);
        console.log('✅ Normalization successful!');
        console.log(JSON.stringify(res.body, null, 2));
        console.log('----------------------------------\n');
        return res;
    };
    return res;
};

// --- Test Execution Function ---
const runTest = async (name, input) => {
    console.log(`\n======================================================`);
    console.log(`RUNNING TEST: ${name}`);
    console.log(`Input Text:\n"${input}"`);
    console.log(`======================================================`);

    const req = mockRequest(input);
    const res = mockResponse();
    const mockCurrencyHint = "INR"; // This would normally come from Step 1

    try {
        const result = await normalizeData(req, res, input, mockCurrencyHint);
        // Since normalizeData now returns the object, we can directly log it.
        res.status(200).json(result);
    } catch (error) {
        console.error("Test Error:", error);
    }
};

// --- Run Test ---
runTest("Realistic Natural Language Normalization Test", inputText);