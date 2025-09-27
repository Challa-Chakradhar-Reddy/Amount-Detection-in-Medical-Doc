import os
import cv2
import numpy as np
import io
from PIL import Image

# Import the core logic functions directly
from preprocessing import preprocess_image
from postprocessing import postprocess_image

def test_ocr_logic():
    image_path = "1.png"

    if not os.path.exists(image_path):
        print(f"Error: The test image file '{image_path}' was not found.")
        print("Please create a dummy image file named 'test_bill.jpg' in the same directory.")
        return

    try:
        with open(image_path, "rb") as image_file:
            image_bytes = image_file.read()
            
            print("1. Preprocessing image...")
            preprocessed_image = preprocess_image(image_bytes)
            
            if preprocessed_image is not None:
                print("✅ Image preprocessing complete.")
                
                print("\n2. Post-processing (OCR) on the preprocessed image...")
                extracted_text = postprocess_image(preprocessed_image)
                
                if extracted_text is not None:
                    print("✅ OCR complete. Extracted text is:")
                    print("-" * 20)
                    print(extracted_text)
                    print("-" * 20)
                else:
                    print("❌ OCR failed to extract any text.")
            else:
                print("❌ Preprocessing failed. Could not proceed with OCR.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_ocr_logic()