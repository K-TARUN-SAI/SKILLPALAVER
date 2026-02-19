from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str # 'recruiter' or 'candidate'

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int

class CandidateBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    skills: Optional[str] = None
    total_experience: Optional[float] = None
    current_role: Optional[str] = None
    companies: Optional[str] = None

class CandidateCreate(CandidateBase):
    raw_text: str
    resume_filename: str

class CandidateResponse(CandidateBase):
    id: int
    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: Optional[str] = None

class JobResponse(JobCreate):
    id: int
    recruiter_id: Optional[int] = None
    has_applied: Optional[bool] = False
    match_score: Optional[float] = None
    class Config:
        from_attributes = True

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class QuizCreate(BaseModel):
    job_id: int
    questions: List[QuizQuestion]

class QuizSubmit(BaseModel):
    job_id: int
    candidate_id: int
    answers: List[str] # List of selected options corresponding to questions order

class MatchRequest(BaseModel):
    job_id: int

class RankingResponse(BaseModel):
    candidate_id: int
    candidate_name: str
    match_score: float
    quiz_score: float
    final_score: float
    rank: int

class ApplicationCreate(BaseModel):
    job_id: int

class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: str
    class Config:
        from_attributes = True

class MatchScoreResponse(BaseModel):
    job_id: int
    score: float
