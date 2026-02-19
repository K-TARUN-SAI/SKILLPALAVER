from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Application, Job, User, Candidate, MatchResult
from schemas import ApplicationCreate, ApplicationResponse
from auth import get_current_user, get_current_candidate
import llm

router = APIRouter()

from fastapi import UploadFile, File
from pypdf import PdfReader
import io
import rag

@router.post("/apply/{job_id}", response_model=ApplicationResponse)
async def apply_to_job(job_id: int, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_candidate)):
    # 1. Read & Parse PDF Resume
    content = await file.read()
    pdf = PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
        
    # 2. Update or Create Candidate Profile
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    
    # Extract structured data only if we need to fill/update profile fields
    # For efficiency, we always update to ensure latest resume info is used
    structured_data = llm.extract_structured_data(text)
    
    if not candidate:
        # Create new profile
        candidate = Candidate(
            name=structured_data.get("name", current_user.name or "Unknown"),
            email=structured_data.get("email", current_user.email or "Unknown"),
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
    else:
        # Update existing profile with new resume data
        candidate.raw_text = text
        candidate.resume_filename = file.filename
        candidate.skills = structured_data.get("skills", candidate.skills)
        candidate.total_experience = structured_data.get("total_experience", candidate.total_experience)
        candidate.current_role = structured_data.get("current_role", candidate.current_role)
        candidate.companies = structured_data.get("companies", candidate.companies)
        # We don't overwrite name/email/phone potentially to avoid overwriting user edits, 
        # but for now we trust the resume for these fields if valid.
        
    db.commit()
    db.refresh(candidate)
    
    # Update Vector Store
    rag.vector_store.add_candidate(text, candidate.id)

    # 3. Check if Job exists
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 4. Check if already applied
    existing_application = db.query(Application).filter(
        Application.job_id == job_id,
        Application.candidate_id == candidate.id
    ).first()

    if existing_application:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    # 5. Create Application
    new_application = Application(
        job_id=job_id,
        candidate_id=candidate.id,
        status="Applied"
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    # 6. Trigger Matching
    try:
        match_data = llm.match_candidate(candidate.raw_text, job.description)
        
        existing_result = db.query(MatchResult).filter(MatchResult.job_id == job_id, MatchResult.candidate_id == candidate.id).first()
        if not existing_result:
            match_result = MatchResult(
                job_id=job_id,
                candidate_id=candidate.id,
                skill_match_percentage=match_data.get("skill_match_percentage", 0),
                experience_match_percentage=match_data.get("experience_match_percentage", 0),
                overall_match_score=match_data.get("overall_match_score", 0),
                reasoning=match_data.get("reasoning", "")
            )
            db.add(match_result)
        else:
            existing_result.skill_match_percentage = match_data.get("skill_match_percentage", 0)
            existing_result.experience_match_percentage = match_data.get("experience_match_percentage", 0)
            existing_result.overall_match_score = match_data.get("overall_match_score", 0)
            existing_result.reasoning = match_data.get("reasoning", "")
        
        db.commit()
    except Exception as e:
        print(f"Error during auto-matching: {e}")

    return new_application
