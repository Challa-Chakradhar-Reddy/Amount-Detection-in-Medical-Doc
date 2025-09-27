from flask import Flask, request, jsonify
from preprocessing import preprocess_image
from postprocessing import postprocess_image

app = Flask(__name__)

@app.route('/process-image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image_bytes = image_file.read()

    preprocessed_image = preprocess_image(image_bytes)
    
    if preprocessed_image is None:
        return jsonify({"error": "Image preprocessing failed"}), 500

    extracted_text = postprocess_image(preprocessed_image)
    
    if extracted_text is None:
        return jsonify({"error": "OCR post-processing failed"}), 500

    return jsonify({"extracted_text": extracted_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)