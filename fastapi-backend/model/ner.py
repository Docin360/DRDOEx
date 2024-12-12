import spacy
import re
from datetime import datetime

# Load spaCy model (customize if retraining later)
nlp = spacy.load("C:/Users/skand/OneDrive/Desktop/DRDOEx/fastapi-backend/model/fine_tuned_ner_model")  # Use a blank English pipeline for custom training

def validate_name(name):
    """Validate that the name contains only letters and spaces."""
    return bool(re.match(r'^[A-Za-z\s]+$', name))

def validate_dob(dob):
    """Validate that the date of birth is in DD/MM/YYYY format."""
    try:
        # Supports formats like '25-Sep-1996' and '25/09/1996'
        datetime.strptime(dob, '%d/%m/%Y')
        return True
    except ValueError:
        try:
            datetime.strptime(dob, '%d-%b-%Y')  # For format like '25-Sep-1996'
            return True
        except ValueError:
            return False

def validate_gender(gender):
    """Validate that the gender is one of the expected values."""
    return gender.lower() in ["male", "female", "other", "transgender"]

def validate_gate_score(score):
    """Validate GATE score as a valid float or integer."""
    try:
        score = float(score)
        return 0 <= score <= 100  # Adjust range based on GATE scoring
    except ValueError:
        return False

def extract_entities(text):
    """
    Extract Name, Date of Birth, and GATE Score from text using spaCy and regex.
    """
    doc = nlp(text)
    entities = {"NAME": None, "DOB": None, "GATE_SCORE": None}

    # Extract entities using spaCy NER
    for ent in doc.ents:
        if ent.label_.lower == "name"  and validate_name(ent.text):  # Name
            entities["NAME"] = ent.text
        elif ent.label_.lower == "date of birth" or ent.label_.lower == "dob" and validate_dob(ent.text):  # DOB
            entities["DOB"] = ent.text
        elif ent.label_.lower == "score" and validate_gate_score(ent.text):  # GATE Score
            entities["GATE_SCORE"] = ent.text

    # Improved regex patterns for specific extraction
    name_pattern = r'(?:Name|Candidate\s*Name)\s*[:\-]?\s*([A-Z][a-z]+\s[A-Z][a-z]+)'  # Name after 'Name' or 'Candidate Name'
    dob_pattern = r'(?:DOB|Date\s*of\s*Birth)\s*[:\-]?\s*(\d{2}[\/\-][A-Za-z]{3}[\/\-]\d{4}|\d{2}\/\d{2}\/\d{4})'  # DOB format support
    gate_score_pattern = r'GATE\s*Score\s*[:\-]?\s*(\d{1,3}(\.\d{1,2})?)'  # GATE Score (integer or decimal)

    # Fallback for Name (after "Name" or "Candidate Name")
    if not entities["NAME"]:
        name_match = re.search(name_pattern, text)
        if name_match:
            entities["NAME"] = name_match.group(1)

    # Fallback for DOB (after "DOB" or "Date of Birth")
    if not entities["DOB"]:
        dob_match = re.search(dob_pattern, text)
        if dob_match and validate_dob(dob_match.group(1)):
            entities["DOB"] = dob_match.group(1)

    # Fallback for GATE Score
    if not entities["GATE_SCORE"]:
        score_match = re.search(gate_score_pattern, text)
        if score_match and validate_gate_score(score_match.group(1)):
            entities["GATE_SCORE"] = score_match.group(1)

    return entities