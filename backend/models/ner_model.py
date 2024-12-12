import spacy
import re
from datetime import datetime

# Load spaCy model
nlp = spacy.load("xx_ent_wiki_sm")  # Multilingual model

def validate_name(name):
    """Validate that the name contains only letters and spaces."""
    return bool(re.match(r'^[A-Za-z\s]+$', name))

def validate_dob(dob):
    """Validate that the date of birth is in DD/MM/YYYY format."""
    try:
        datetime.strptime(dob, '%d/%m/%Y')
        return True
    except ValueError:
        return False

def validate_gender(gender):
    """Validate that the gender is one of the expected values."""
    return gender.lower() in ["male", "female", "other", "transgender"]

def extract_entities(text):
    """
    Use spaCy NER to extract Name, Date of Birth, and Gender from text.
    Also uses regex as a fallback to ensure extraction of entities.
    """
    doc = nlp(text)
    entities = {"NAME": None, "DOB": None, "GENDER": None}

    # Extract entities using spaCy NER
    for ent in doc.ents:
        if ent.label_ == "PER" and validate_name(ent.text):  # Name
            entities["NAME"] = ent.text
        elif re.search(r'\d{2}/\d{2}/\d{4}', ent.text) and validate_dob(ent.text):  # Date of Birth
            entities["DOB"] = ent.text
        elif "gender" in ent.text.lower() and validate_gender(ent.text):  # Gender
            entities["GENDER"] = ent.text

    # Regex patterns for fallback
    name_pattern = r'([A-Z][a-z]*\s[A-Z][a-z]*)'
    dob_pattern = r'\d{2}/\d{2}/\d{4}'
    gender_pattern = r'\b(Male|Female|Other|Transgender)\b'

    # Fallback for Name
    if not entities["NAME"]:
        name_match = re.search(name_pattern, text)
        if name_match and validate_name(name_match.group(0)):
            entities["NAME"] = name_match.group(0)

    # Fallback for Date of Birth
    if not entities["DOB"]:
        dob_match = re.search(dob_pattern, text)
        if dob_match and validate_dob(dob_match.group(0)):
            entities["DOB"] = dob_match.group(0)

    # Fallback for Gender
    if not entities["GENDER"]:
        gender_match = re.search(gender_pattern, text, re.IGNORECASE)
        if gender_match and validate_gender(gender_match.group(0)):
            entities["GENDER"] = gender_match.group(0).capitalize()

    return entities

