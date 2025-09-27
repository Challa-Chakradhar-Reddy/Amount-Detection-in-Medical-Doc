import os
from dotenv import load_dotenv
import pytesseract
import io
from PIL import Image
from openai import OpenAI
import traceback

# Load environment variables from .env file
load_dotenv()

# Initialize the OpenAI client for Groq API
# This points the client to the Groq API endpoint
client = OpenAI(
    api_key=os.environ.get("GROQ_API"),
    base_url="https://api.groq.com/openai/v1",
)

def ocr_with_tesseract(image):
    """
    Performs initial, raw OCR using pytesseract.
    """
    try:
        # Pytesseract expects a PIL Image object
        pil_image = Image.fromarray(image)
        raw_text = pytesseract.image_to_string(pil_image)
        return raw_text
    except Exception as e:
        traceback.print_exc()
        return None

def postprocess_image(image):
    """
    Runs initial OCR on the preprocessed image and then sends the
    extracted text to the Groq API for normalization and cleaning.
    """
    try:
        # Step 1: Initial OCR to get raw text
        extracted_text = ocr_with_tesseract(image)
        
        if not extracted_text:
            return "No text extracted from image."

        # Step 2: Use Groq LLM to normalize the raw text
        prompt = f"""
You are a text normalization expert. Correct any OCR-like errors in the following text. Then, return the corrected text as a detailed paragraph. Prioritize the accuracy of numbers and financial terms.

Original text:
"{extracted_text}"
"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a text normalization expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        normalized_text = response.choices[0].message.content
        return normalized_text

    except Exception as e:
        traceback.print_exc()
        return None