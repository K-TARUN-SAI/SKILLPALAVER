def calculate_final_score(match_score, quiz_score):
    # final_score = (0.6 * overall_match_score) + (0.4 * quiz_score)
    # Ensure scores are normalized if needed. Assuming 0-100 input.
    return (0.6 * match_score) + (0.4 * quiz_score)
