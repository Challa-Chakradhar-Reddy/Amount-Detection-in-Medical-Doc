// import express from 'express';
// import classifyInput from '../classifyInput.js';
// import { processTextPipeline } from '../controllers/textCombineController.js';

// const router = express.Router();

// router.post('/process-document', classifyInput, (req, res) => {
//     if (req.inputType === 'image_file') {
//         return res.status(200).json({ input_type: req.inputType, message: 'Image file received. OCR processing pending.' });
//     } else if (req.inputType === 'image_path') {
//         return res.status(200).json({ input_type: req.inputType, message: 'Image path received. OCR processing pending.' });
//     } else if (req.inputType === 'text') {
//         return processTextPipeline(req, res);
//     }
//     return res.status(400).json({ status: 'error', message: 'Invalid input format.' });
// });

// export default router;


import express from 'express';
import classifyInput from '../Middleware/classifyInput.js';
import { processTextPipeline } from '../controllers/textCombineController.js';
import { processImageFile } from '../controllers/fileController.js';
import { processImagePath } from '../controllers/pathController.js';

const router = express.Router();

router.post('/process-document', classifyInput, (req, res) => {
    if (req.inputType === 'image_file') {
        return processImageFile(req, res);
    } else if (req.inputType === 'image_path') {
        return processImagePath(req, res);
    } else if (req.inputType === 'text') {
        return processTextPipeline(req, res);
    }
    return res.status(400).json({ status: 'error', message: 'Invalid input format.' });
});

export default router;