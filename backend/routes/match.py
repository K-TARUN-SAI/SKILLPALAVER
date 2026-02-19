from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Job, Candidate, MatchResult, FinalRanking
from schemas import MatchRequest
import rag
import llm

router = APIRouter()

from auth import get_current_recruiter
from models import Job, Candidate, MatchResult, FinalRanking, User

@router.post("/match/{job_id}")
def match_candidates(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # 1. Fetch Applicants ONLY
    from models import Application
    applications = db.query(Application).filter(Application.job_id == job_id).all()
    
    matched_candidates = []
    
    for app in applications:
        candidate_id = app.candidate_id
        candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
        if not candidate:
            continue
            
        # 2. Check for existing Match Result (Computed at application time usually)
        # If not present, compute it now.
        existing_result = db.query(MatchResult).filter(MatchResult.job_id == job_id, MatchResult.candidate_id == candidate_id).first()
        
        match_data = {}
        if existing_result:
             match_data = {
                 "candidate_id": candidate_id,
                 "candidate_name": candidate.name,
                 "overall_match_score": existing_result.overall_match_score,
                 "reasoning": existing_result.reasoning
             }
        else:
             # Fallback if matching wasn't done at apply time
             match_data = llm.match_candidate(candidate.raw_text, job.description)
             
             match_result = MatchResult(
                job_id=job_id,
                candidate_id=candidate_id,
                skill_match_percentage=match_data.get("skill_match_percentage", 0),
                experience_match_percentage=match_data.get("experience_match_percentage", 0),
                overall_match_score=match_data.get("overall_match_score", 0),
                reasoning=match_data.get("reasoning", "")
             )
             db.add(match_result)
             db.commit()
        
        matched_candidates.append(match_data)

    return {"status": "matched", "candidates_processed": len(matched_candidates)}

@router.post("/notify-candidate/{job_id}/{candidate_id}")
def notify_candidate(job_id: int, candidate_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)):
    job = db.query(Job).filter(Job.id == job_id).first()
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    
    if not job or not candidate:
        raise HTTPException(status_code=404, detail="Job or Candidate not found")
        
    # Construct Quiz Link (Hardcoded for local dev)
    # Assuming frontend runs on localhost:5173. 
    # In production, this should be an env variable.
    quiz_link = f"http://localhost:5173/quiz/{job_id}?candidate_id={candidate_id}"
    
    # Determine recipient email (Use registered user email if available, else resume email)
    recipient_email = candidate.email
    if candidate.user:
        recipient_email = candidate.user.email
    
    import email_service
    success = email_service.send_quiz_link(recipient_email, candidate.name, job.title, quiz_link)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email. Check server logs/credentials.")
        
    return {"status": "success", "message": f"Quiz link sent to {candidate.email}"}
