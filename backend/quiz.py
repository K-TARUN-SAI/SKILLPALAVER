def calculate_quiz_score(correct_answers, user_answers):
    # correct_answers: list of correct option strings (e.g., ["A", "B", ...])
    # user_answers: list of user selected option strings
    if not correct_answers or not user_answers:
        return 0.0
    
    score = 0
    total = len(correct_answers)
    
    for i in range(min(total, len(user_answers))):
        if correct_answers[i] == user_answers[i]:
            score += 1
            
    return (score / total) * 100
