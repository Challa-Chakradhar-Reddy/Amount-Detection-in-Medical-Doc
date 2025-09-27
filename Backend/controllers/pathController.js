import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { processTextPipeline } from './textCombineController.js';


export const processImagePath = async (req, res) => {
    try {
        const imagePath = req.body;
        const resolvedPath = path.resolve(imagePath);

        if (!fs.existsSync(resolvedPath)) {
            return res.status(400).json({ status: 'error', reason: 'Image file not found at the specified path.' });
        }

        const imageBuffer = fs.readFileSync(resolvedPath);
        const imageName = path.basename(resolvedPath);

        const formData = new FormData();
        formData.append('image', imageBuffer, imageName);

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
        console.error('Error processing image from path:', error);
        return res.status(500).json({ status: 'error', reason: 'Failed to process image from path.' });
    }
};