from django.db import models
from django.contrib.auth.models import User


class Note(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    title = models.CharField(max_length=255)
    pdf_file = models.FileField(upload_to="notes/pdfs/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True, null=True)  # Store text after parsing

    def __str__(self):
        return f"{self.title} by {self.student.username}"
    
class QA(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="qas")
    question = models.TextField()
    answer = models.TextField()

    def __str__(self):
        return f"Q: {self.question[:50]}..."