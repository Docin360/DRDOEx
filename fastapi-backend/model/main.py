from fastapi import FastAPI, File, UploadFile, HTTPException
from typing import List
from ocr import extract_text_from_image
from ner import extract_entities
import io
import logging
import asyncio
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

@app.post("/process-files/")
async def process_files(files: List[UploadFile] = File(...)):
    """
    Handles multiple PDF uploads, processes them through OCR,
    then extracts entities via the NER model.
    """
    results = {"success": [], "failed": []}

    async def process_file(file: UploadFile):
        try:
            # Validate file type
            if not file.filename.endswith(".pdf"):
                return {
                    "file": file.filename,
                    "status": "error",
                    "message": "Unsupported file type. Only PDFs are allowed.",
                }

            # Read uploaded file into memory
            file_content = await file.read()
            pdf_file = io.BytesIO(file_content)

            # Log processing start
            logger.info(f"Processing file: {file.filename}")

            # Step 1: OCR processing
            extracted_text = extract_text_from_image(pdf_file)

             # Clean up the text: Remove unwanted characters, line breaks, etc.
            cleaned_text = extracted_text.replace("\n", "").replace("\r", "")  # Remove newlines

            # Combine relevant fields by removing spaces and unwanted characters
            cleaned_text = re.sub(r'\s+', '', cleaned_text)  # Remove all spaces

            # Step 2: NER processing
            ner_results = {page: extract_entities(text) for page, text in extracted_text.items()}

            # Step 3: Save NER results to a .txt file
            txt_filename = f"{file.filename}_ner_results.txt"
            with open(txt_filename, "w") as txt_file:
                # Write NER results to the text file
                for page, entities in ner_results.items():
                    txt_file.write(f"Page {page}:\n")
                    for entity in entities:
                        txt_file.write(f"{entity}\n")
                    txt_file.write("\n")  # Add a newline between pages

            
            # Return success result
            return {"file": file.filename, "status": "success", "ner_results": ner_results}

        except Exception as e:
            logger.error(f"Error processing file {file.filename}: {e}")
            return {"file": file.filename, "status": "error", "message": str(e)}

    # Process files concurrently
    processed_files = await asyncio.gather(*(process_file(file) for file in files))
    
    for result in processed_files:
        if result["status"] == "success":
            results["success"].append(result)
        else:
            results["failed"].append(result)

    return results
