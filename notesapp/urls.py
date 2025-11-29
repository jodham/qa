from django.urls import path
from . import views

urlpatterns = [
    path("", views.upload_page, name="upload_page"),         # serves the upload interface
    path("upload-pdf/", views.upload_pdf, name="upload_pdf"),      # API: POST only
    path("save-qa/", views.save_qa, name="save_qa"),               # API: POST
    path("generate-qa-fallback/", views.generate_qa_fallback, name="generate_qa_fallback"),
    path("index/", views.index, name="index"),               # API: POST
    path("note/<int:note_id>/", views.note_detail, name="note_detail"),  # detail view for a note
    path("note/<int:note_id>/delete/", views.delete_note, name="delete_note"),  # delete a note
]
