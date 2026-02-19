try:
    import fastapi
    import uvicorn
    import sqlalchemy
    import pymysql
    import pypdf
    import sentence_transformers
    import faiss
    import multipart
    import requests
    import pydantic
    import pydantic_settings
    import dotenv
    import cryptography
    import jose
    import passlib
    import email_validator
    print("All imports successful")
except ImportError as e:
    print(f"Import failed: {e}")
except Exception as e:
    print(f"An error occurred: {e}")
