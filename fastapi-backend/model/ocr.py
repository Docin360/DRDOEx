import os
import logging
from google.cloud import vision
from pdf2image import convert_from_path
import io

# Setup logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\skand\\Downloads\\drdoextraction-444309-ac9109622a07.json"


# Initialize Pytesseract
client = vision.ImageAnnotatorClient()

def extract_text_from_file(file_path):
    """
    Extract text from both images and PDFs. 

    """
    try:
        # Check if the file is an image
        if file_path.endswith(('.png', '.jpg', '.jpeg')):
            return extract_text_from_image(file_path)
        
        # Check if the file is a PDF
        elif file_path.endswith('.pdf'):
            return extract_text_from_pdf(file_path)
        
        else:
            raise ValueError("Unsupported file format. Only image and PDF files are supported.")
    
    except Exception as e:
        logging.error(f"Error during text extraction from {file_path}: {e}")
        raise

def extract_text_from_image(image_path):
    """
    Use PyTesseract to extract text from an image.
    """
    try:
        with open(image_path, "rb") as image_file:
            content = image_file.read()

        image = vision.Image(content=content)
        response = client.text_detection(image=image)

        if response.error.message:
            raise Exception(f"OCR error: {response.error.message}")

        # Extract all text from the image
        ocr_text = response.full_text_annotation.text
        logging.info(f"OCR extracted text from image {image_path}: {ocr_text}")
        
        return ocr_text

    except Exception as e:
        logging.error(f"Error during OCR extraction for image {image_path}: {e}")
        raise

def extract_text_from_pdf(pdf_path):
    """
    Convert PDF to images and use Google Vision API to extract text from each page.
    """
    try:
        # Convert each page of the PDF to an image (300 DPI is standard for OCR quality)
        pages = convert_from_path(pdf_path, 300)  # 300 DPI
        
        extracted_text = ""
        for page_number, page in enumerate(pages):
            # Convert the page to a byte stream (image)
            byte_io = io.BytesIO()
            page.save(byte_io, format="PNG")
            byte_io.seek(0)  # Rewind the byte stream for reading
            
            # Prepare the image for OCR
            image = vision.Image(content=byte_io.read())
            
            # Use Pytesseract to extract text from the image
            response = client.text_detection(image=image)
            
            if response.error.message:
                raise Exception(f"Google Vision API error on page {page_number + 1}: {response.error.message}")
            
            # Append the text from each page to the overall text
            extracted_text += response.full_text_annotation.text + "\n"
        
        logging.info(f"Text extracted from PDF {pdf_path}: {extracted_text}")
        return extracted_text.strip()

    except Exception as e:
        logging.error(f"Error extracting text from PDF {pdf_path}: {e}")
        raise

if __name__ == "__main__":
    # Example usage
    image_path = "C:/Users/prana/Downloads/dataforgatescorecards"  # Replace with your image path

    # Extract text using OCR
    extracted_text = extract_text_from_image(image_path)
    print("Extracted Text:")
    print(extracted_text)
















































