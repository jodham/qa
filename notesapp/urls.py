from django.urls import path
from . import views

urlpatterns = [
    path("", views.upload_page, name="upload_page"),         # serves the upload interface
    path("upload-pdf/", views.upload_pdf, name="upload_pdf"),      # API: POST only
    path("save-qa/", views.save_qa, name="save_qa"),               # API: POST
    path("generate-qa-fallback/", views.generate_qa_fallback, name="generate_qa_fallback"),
]
