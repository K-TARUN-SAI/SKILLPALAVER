from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import FinalRanking, Candidate, User
from schemas import RankingResponse
from typing import List
from auth import get_current_recruiter

router = APIRouter()

@router.get("/ranking/{job_id}", response_model=List[RankingResponse])
def get_ranking(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)):
    rankings = db.query(FinalRanking).filter(FinalRanking.job_id == job_id).order_by(FinalRanking.final_score.desc()).all()
    
    response = []
    for rank, r in enumerate(rankings, 1):
        candidate = db.query(Candidate).filter(Candidate.id == r.candidate_id).first()
        if candidate:
            response.append(RankingResponse(
                candidate_id=candidate.id,
                candidate_name=candidate.name,
                match_score=r.match_score,
                quiz_score=r.quiz_score,
                final_score=r.final_score,
                rank=rank
            ))
            
    return response

@router.get("/top-candidate/{job_id}", response_model=RankingResponse)
def get_top_candidate(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_recruiter)):
    top_ranking = db.query(FinalRanking).filter(FinalRanking.job_id == job_id).order_by(FinalRanking.final_score.desc()).first()
    
    if not top_ranking:
        raise HTTPException(status_code=404, detail="No ranking found for this job")
        
    candidate = db.query(Candidate).filter(Candidate.id == top_ranking.candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    return RankingResponse(
        candidate_id=candidate.id,
        candidate_name=candidate.name,
        match_score=top_ranking.match_score,
        quiz_score=top_ranking.quiz_score,
        final_score=top_ranking.final_score,
        rank=1
    )
