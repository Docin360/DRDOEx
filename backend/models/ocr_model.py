import os
import logging
from google.cloud import vision

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Set Google Vision API credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\Users\skand\Downloads\drdoextraction-444309-ac9109622a07.json"

# Initialize Google Vision API client
client = vision.ImageAnnotatorClient()

def extract_text_from_image(image_path):
    """
    Use Google Vision API to extract all text from the image.
    """
    try:
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = client.text_detection(image=image)

        if response.error.message:
            raise Exception(f"Google Vision API error: {response.error.message}")

        # Extract all text from the image
        ocr_text = response.full_text_annotation.text
        logging.info(f"OCR extracted text: {ocr_text}")
        
        return ocr_text

    except Exception as e:
        logging.error(f"Error during OCR extraction: {e}")
        raise

if __name__ == "__main__":
    # Example usage
    image_path = "C:/Users/prana/Downloads/sample_image.jpg"  # Replace with your image path

    # Extract text using OCR
    extracted_text = extract_text_from_image(image_path)
    print("Extracted Text:")
    print(extracted_text)
