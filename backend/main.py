from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import resume, job, match, quiz_routes, ranking, auth_routes
import uvicorn

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Candidate Screening System")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(resume.router, prefix="/api", tags=["Resume"])
app.include_router(job.router, prefix="/api", tags=["Job"])
app.include_router(match.router, prefix="/api", tags=["Matching"])
app.include_router(quiz_routes.router, prefix="/api", tags=["Quiz"])
app.include_router(ranking.router, prefix="/api", tags=["Ranking"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
from routes import application
app.include_router(application.router, prefix="/api", tags=["Application"])

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    env = os.environ.get("ENV", "development")
    reload = env == "development"
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=reload)
