from sqlalchemy import Column, Integer, String, Text, ForeignKey, Float, JSON, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50)) # 'recruiter' or 'candidate'

    # Relationships
    jobs = relationship("Job", back_populates="recruiter")
    candidate_profile = relationship("Candidate", back_populates="user", uselist=False)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    requirements = Column(Text)
    recruiter_id = Column(Integer, ForeignKey("users.id"))

    recruiter = relationship("User", back_populates="jobs")
    applications = relationship("Application", back_populates="job")

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    skills = Column(Text)  # Comma-separated or JSON string
    total_experience = Column(Float)
    current_role = Column(String(255))
    companies = Column(Text) # Comma-separated or JSON string
    raw_text = Column(Text)
    resume_filename = Column(String(255))

    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(50), default="Applied") # Applied, Reviewed, Shortlisted, Rejected

    job = relationship("Job", back_populates="applications")
    candidate = relationship("Candidate", back_populates="applications")

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    questions = Column(JSON) # Store list of questions as JSON

    job = relationship("Job")

class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    skill_match_percentage = Column(Float)
    experience_match_percentage = Column(Float)
    overall_match_score = Column(Float)
    reasoning = Column(Text)
    
    job = relationship("Job")
    candidate = relationship("Candidate")

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    score = Column(Float)
    answers = Column(JSON)

    job = relationship("Job")
    candidate = relationship("Candidate")

class FinalRanking(Base):
    __tablename__ = "final_rankings"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    match_score = Column(Float)
    quiz_score = Column(Float)
    final_score = Column(Float) # (0.6 * match) + (0.4 * quiz)

    job = relationship("Job")
    candidate = relationship("Candidate")
