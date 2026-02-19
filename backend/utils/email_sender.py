def send_interview_email(candidate_email: str, job_title: str):
    """
    Mock function to send an interview invitation email.
    In a real application, this would use SMTP or an email service (e.g., SendGrid, AWS SES).
    """
    print("="*60)
    print(f"📧 [EMAIL SIMULATION] Sending email to: {candidate_email}")
    print(f"Subject: Interview Invitation - {job_title}")
    print(f"Body:\nDear Candidate,\n\nCongratulations! You have passed the initial screening for the {job_title} position.\nWe would like to invite you for an in-person interview.\n\nBest Regards,\nHireGenius AI Team")
    print("="*60)
    return True
