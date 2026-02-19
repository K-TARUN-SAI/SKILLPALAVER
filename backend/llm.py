import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

# Initialize Groq Client
# Ensure GROQ_API_KEY is set in .env
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def query_llm(prompt, model="llama-3.1-8b-instant", json_mode=True):
    """
    Query Groq API with Llama 3 model.
    """
    messages = [
        {"role": "user", "content": prompt}
    ]
    
    kwargs = {
        "model": model,
        "messages": messages,
        "temperature": 0.1,
    }
    
    if json_mode:
        kwargs["response_format"] = {"type": "json_object"}
        
    try:
        chat_completion = client.chat.completions.create(**kwargs)
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error querying Groq: {e}")
        return None

import re

def extract_contact_info(text):
    """
    Extracts email and phone number using Regex.
    """
    # Regex for Email
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    email = emails[0] if emails else "Unknown"

    # Regex for Phone (Supports various formats: +91, 0-9, dashes, spaces)
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    # Filter out short matches that might be dates/years
    valid_phones = [p for p in phones if len(re.sub(r'\D', '', p if isinstance(p, str) else "".join(p))) >= 10]
    phone = valid_phones[0] if valid_phones else ""
    if isinstance(phone, tuple): phone = "".join(phone) # Handle regex groups

    return {"email": email, "phone": phone.strip()}

def extract_structured_data(text):
    # 1. Fast Extraction (Regex)
    contact_info = extract_contact_info(text)

    # 2. Context Extraction (LLM) - Skip already extracted fields
    prompt = f"""
    Extract the following information from the resume text below and return strictly as a JSON object.
    
    JSON Schema:
    {{
        "name": "string",
        "skills": "string (comma separated)",
        "total_experience": number (in years),
        "current_role": "string",
        "companies": "string (comma separated)"
    }}
    
    Resume Text:
    {text[:6000]}
    """
    response = query_llm(prompt)
    structured_data = {}
    try:
        structured_data = json.loads(response)
    except:
        structured_data = {}
    
    # Merge Results
    structured_data["email"] = contact_info["email"]
    structured_data["phone"] = contact_info["phone"]
    
    return structured_data

def match_candidate(resume_text, job_description):
    prompt = f"""
    You are an AI Recruiter. Compare the candidate's resume with the job description.
    Return the result strictly in this JSON format:
    {{
        "skill_match_percentage": number (0-100),
        "experience_match_percentage": number (0-100),
        "overall_match_score": number (0-100),
        "reasoning": "short explanation"
    }}

    Job Description:
    {job_description[:3000]}

    Resume:
    {resume_text[:3000]}
    """
    response = query_llm(prompt)
    if not response:
        return {"skill_match_percentage": 0, "experience_match_percentage": 0, "overall_match_score": 0, "reasoning": "Error querying LLM"}
        
    try:
        return json.loads(response)
    except:
        return {"skill_match_percentage": 0, "experience_match_percentage": 0, "overall_match_score": 0, "reasoning": "Error parsing LLM response"}

def generate_quiz_questions(job_description):
    prompt = f"""
    Generate 10 Multiple Choice Questions (MCQs) based on the following job description.
    Return strictly as a JSON object containing a key "questions" which is an array of objects.
    
    JSON Format:
    {{
        "questions": [
            {{
                "question": "string",
                "options": ["A", "B", "C", "D"],
                "correct_answer": "string (must match one of the options)"
            }}
        ]
    }}

    Job Description:
    {job_description[:3000]}
    """
    response = query_llm(prompt)
    if not response:
        return []

    try:
        data = json.loads(response)
        if isinstance(data, list):
            return data
        return data.get("questions", [])
    except:
        return []
