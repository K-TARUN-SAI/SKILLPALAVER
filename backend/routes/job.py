from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Job, User
from schemas import JobCreate, JobResponse
from auth import get_current_recruiter

router = APIRouter()

@router.post("/create-job", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)):
    new_job = Job(
        title=job.title,
        description=job.description,
        requirements=job.requirements,
        recruiter_id=current_user.id
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/jobs", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)): # This dependency is tricky, might need optional auth
    # Check if user is candidate to show match scores
    # For now, let's just return all jobs.
    # To support candidate view with scores, we really need to know if it's a candidate.
    # But get_current_recruiter enforces recruiter role.
    # We should probably have a separate endpoint or make auth optional/generic.
    return db.query(Job).all()

from auth import get_current_user_optional
from models import Candidate, Application
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import rag

@router.get("/jobs/candidate-view", response_model=list[JobResponse])
def get_jobs_candidate(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_optional)):
    jobs = db.query(Job).all()
    
    if not current_user or current_user.role != 'candidate':
        return jobs
        
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    if not candidate or not candidate.raw_text:
        return jobs
        
    # Calculate simple embeddings match
    candidate_embedding = rag.get_embedding(candidate.raw_text).reshape(1, -1)
    
    job_responses = []
    for job in jobs:
        # Check if applied
        has_applied = db.query(Application).filter(
            Application.job_id == job.id, 
            Application.candidate_id == candidate.id
        ).first() is not None
        
        # Calculate Score
        job_embedding = rag.get_embedding(job.description).reshape(1, -1)
        similarity = cosine_similarity(candidate_embedding, job_embedding)[0][0]
        match_score = float(similarity) * 100 # percentage
        
        job_resp = JobResponse.from_orm(job)
        job_resp.has_applied = has_applied
        job_resp.match_score = round(match_score, 1)
        job_responses.append(job_resp)
        
    return job_responses
