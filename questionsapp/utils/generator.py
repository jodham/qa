def generate_questions_and_answers(text, num=5):
    # Placeholder logic: just split into sentences
    sentences = text.split(".")
    qa_pairs = []
    for i, s in enumerate(sentences[:num]):
        question = f"What is the meaning of: {s.strip()}?"
        answer = s.strip()
        qa_pairs.append((question, answer))
    return qa_pairs
