from .models import Question, Answer

def save_generated_qa(note, qa_pairs):
    for q_text, a_text in qa_pairs:
        q = Question.objects.create(note=note, text=q_text)
        Answer.objects.create(question=q, text=a_text)
