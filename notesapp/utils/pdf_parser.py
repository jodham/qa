from pydoc import text
import PyPDF2
import pdfplumber
from langchain_openai import ChatOpenAI
from notesapp.models import QA
import os

OPENROUTER_API_KEY= os.environ.get("OPENROUTER_API_KEY")

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text


    # setup the client once
cloud_llm = ChatOpenAI(
    model="qwen/qwen3-30b-a3b",  # or whatever you like
    api_key=OPENROUTER_API_KEY,         # ideally from settings or env
    base_url="https://openrouter.ai/api/v1"
)
#qwen/qwen3-30b-a3b
def generate_qa(note):
    # 1. Extract text
    text = extract_text_from_pdf(note.pdf_file.path)
    note.extracted_text = text
    note.save(update_fields=["extracted_text"])

    # 2. Prompt
    prompt = f"""
    Read the following document and generate 5 meaningful questions and answers
    that summarize the key ideas. Format strictly as:
    Q: <question>
    A: <answer>

    Document:
    {text}
    """

    # 3. Call model
    response = cloud_llm.invoke(prompt)
    qa_text = response.content.strip()

    # 4. Parse and store
    for block in qa_text.split("Q:"):
        block = block.strip()
        if not block:
            continue
        try:
            q, a = block.split("A:", 1)
            QA.objects.create(
                note=note,
                question=q.strip(),
                answer=a.strip()
            )
        except ValueError:
            continue