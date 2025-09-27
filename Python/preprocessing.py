import numpy as np
import io
from PIL import Image
import cv2
import traceback

def preprocess_image(image_bytes):
    try:
        image_stream = io.BytesIO(image_bytes)
        pil_image = Image.open(image_stream).convert('RGB')
        
        opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
        denoised = cv2.medianBlur(gray, 5)

        thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                        cv2.THRESH_BINARY_INV, 11, 2)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        final_image = clahe.apply(gray)
        
        return thresh

    except Exception as e:
        traceback.print_exc()
        return None