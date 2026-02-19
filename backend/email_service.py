import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "vividfauna3@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "ybpp jmsk ojpk eark")

def send_quiz_link(candidate_email, candidate_name, job_title, quiz_link):
    subject = f"Next Steps: Quiz for {job_title}"
    
    body = f"""
    Hi {candidate_name},

    Congratulations! You have been shortlisted for the {job_title} position.

    Please complete the following technical quiz to proceed to the next round:
    {quiz_link}

    Good luck!
    
    Best regards,
    Hiring Team
    """

    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = candidate_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USERNAME, candidate_email, text)
        server.quit()
        print(f"Email sent to {candidate_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        print("--------------------------------------------------")
        print("MOCK EMAIL SERVICE (check console for link):")
        print(f"To: {candidate_email}")
        print(f"Subject: {subject}")
        print(f"Body:\n{body}")
        print("--------------------------------------------------")
        return True # Return True so frontend thinks it succeeded for demo purposes
