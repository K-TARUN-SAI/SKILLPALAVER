from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Candidate, User
from schemas import CandidateResponse
from auth import get_current_user
from pypdf import PdfReader
import io
import llm
import rag
import json

router = APIRouter()

@router.post("/upload-resume", response_model=CandidateResponse)
async def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Read PDF
    content = await file.read()
    pdf = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    
    # 2. Extract Structured Data via LLM
    structured_data = llm.extract_structured_data(text)
    
    # 3. Store in DB
    candidate = Candidate(
        name=structured_data.get("name", "Unknown"),
        email=structured_data.get("email", "Unknown"),
        phone=structured_data.get("phone", ""),
        skills=structured_data.get("skills", ""),
        total_experience=structured_data.get("total_experience", 0.0),
        current_role=structured_data.get("current_role", ""),
        companies=structured_data.get("companies", ""),
        raw_text=text,
        resume_filename=file.filename,
        user_id=current_user.id
    )
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    
    # 4. Generate Embedding and Store in FAISS
    rag.vector_store.add_candidate(text, candidate.id)
    
    return candidate
