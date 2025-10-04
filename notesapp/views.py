# views.py
import os
import json
import logging
from langchain_openai import ChatOpenAI
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

from .forms import NoteForm
from .models import Note, QA
from .utils.pdf_parser import extract_text_from_pdf

# OpenRouter / langchain client (same as your previous snippet)
from langchain_openai import ChatOpenAI

logger = logging.getLogger(__name__)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")
REMOTE_BASE_URL = os.environ.get("REMOTE_BASE_URL")  # e.g. "https://openrouter.ai/api/v1"
REMOTE_MODEL_NAME = os.environ.get("REMOTE_MODEL_NAME", "qwen/qwen3-30b-a3b")

cloud_llm = ChatOpenAI(
    model=REMOTE_MODEL_NAME,
    api_key=OPENROUTER_API_KEY,
    base_url=REMOTE_BASE_URL
)


def upload_page(request):
    return render(request, "index/home.html")


@login_required
@require_POST
def upload_pdf(request):
    """
    API: Accepts file upload, creates Note, extracts text, returns {note_id, text}.
    """
    form = NoteForm(request.POST, request.FILES)
    if not form.is_valid():
        return JsonResponse({"error": "invalid form", "details": form.errors}, status=400)

    note = form.save(commit=False)
    note.student = request.user
    note.save()

    # extract
    text = extract_text_from_pdf(note.pdf_file.path)
    note.extracted_text = text
    note.save(update_fields=["extracted_text"])

    return JsonResponse({"note_id": note.id, "text": text})


@login_required
@require_POST
def save_qa(request):
    """
    API: Save pre-generated qa_text (from Puter) into the DB.
    Expects JSON: { note_id, qa_text }
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid json"}, status=400)

    note_id = payload.get("note_id")
    qa_text = payload.get("qa_text", "")
    if not note_id or not qa_text:
        return JsonResponse({"error": "missing fields"}, status=400)

    note = get_object_or_404(Note, pk=note_id, student=request.user)

    saved_ids = []
    for block in qa_text.split("Q:"):
        block = block.strip()
        if not block or "A:" not in block:
            continue
        q, a = block.split("A:", 1)
        obj = QA.objects.create(note=note, question=q.strip(), answer=a.strip())
        saved_ids.append(obj.id)

    return JsonResponse({"status": "saved", "qa_ids": saved_ids})


@login_required
@require_POST
def generate_qa_fallback(request):
    """
    API fallback: generate QA using OpenRouter server-side, save it and return the text.
    Expects JSON: { note_id, text }
    """
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "invalid json"}, status=400)

    note_id = payload.get("note_id")
    text = payload.get("text", "")
    if not note_id or not text:
        return JsonResponse({"error": "missing fields"}, status=400)

    note = get_object_or_404(Note, pk=note_id, student=request.user)

    prompt = f"""
You are given the content of an academic paper below. Use ONLY the provided text — do NOT invent,
add or assume facts not present in the text. Generate exactly 5 thoughtful Q&A pairs that test deep
understanding of the paper's key ideas. Use this exact output format and nothing else:

Q: <question>
A: <answer>

Academic Paper:
{text}
"""

    try:
        response = cloud_llm.invoke(prompt)
        qa_text = response.content.strip()
    except Exception as exc:
        logger.exception("OpenRouter LLM call failed")
        return JsonResponse({"error": "llm_error", "details": str(exc)}, status=502)

    # Save to DB
    saved_ids = []
    for block in qa_text.split("Q:"):
        block = block.strip()
        if not block or "A:" not in block:
            continue
        q, a = block.split("A:", 1)
        obj = QA.objects.create(note=note, question=q.strip(), answer=a.strip())
        saved_ids.append(obj.id)

    return JsonResponse({"status": "ok", "qa_text": qa_text, "qa_ids": saved_ids})
