import multer from 'multer';
import fs from 'fs';
import path from 'path';

const upload = multer({ storage: multer.memoryStorage() });

const classifyInput = upload.single('document');

export default (req, res, next) => {
    classifyInput(req, res, (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', reason: 'File upload failed.' });
        }
        
        // ... same input classification logic as before ...
        if (req.file) {
            const mimetype = req.file.mimetype;
            if (mimetype.startsWith('image/')) {
                console.log('🖼️ Image received perfectly.');
                req.inputType = 'image_file';
                return next();
            } else {
                console.log('⚠️ Received a non-image file. Rejecting.');
                return res.status(400).json({ status: 'error', reason: 'Only image files are accepted.' });
            }
        }
        
        const input = req.body;
        if (typeof input === 'string') {
            const imageExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.tiff', '.bmp'];
            const fileExtension = path.extname(input).toLowerCase();

            if (imageExtensions.includes(fileExtension) && fs.existsSync(path.resolve(input))) {
                console.log('📂 Image exists in the folder.');
                req.inputType = 'image_path';
                return next();
            } else {
                console.log('📝 Text received perfectly.');
                req.inputType = 'text';
                return next();
            }
        }
        
        return res.status(400).json({ status: 'error', reason: 'Invalid input.' });
    });
};