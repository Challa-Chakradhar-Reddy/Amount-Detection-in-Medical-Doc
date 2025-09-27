import axios from 'axios';
import FormData from 'form-data';
import { processTextPipeline } from './textCombineController.js';

export const processImageFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 'error', reason: 'No image file uploaded.' });
        }

        const formData = new FormData();
        formData.append('image', req.file.buffer, req.file.originalname);

        const flaskResponse = await axios.post('http://localhost:8000/process-image', formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const ocrText = flaskResponse.data.extracted_text;
        
        if (!ocrText || ocrText.length < 10) {
             return res.status(400).json({ status: 'error', reason: 'OCR extraction failed or returned empty text.' });
        }

        req.body = ocrText;
        
        return processTextPipeline(req, res);

    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                status: 'error', 
                reason: 'OCR Service (Flask) is unavailable. Please check python app.py is running on port 8000.' 
            });
        }
        return res.status(500).json({ status: 'error', reason: 'Failed during OCR or pipeline execution.' });
    }
};
