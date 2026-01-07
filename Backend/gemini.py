from fastapi import APIRouter, Depends, HTTPException
import google.generativeai as genai
from pydantic import BaseModel
from typing import Optional
import users 
import os

# --- Configuração do Cliente Gemini ---
# Carregue a chave da variável de ambiente
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("GOOGLE_API_KEY não encontrada nas variáveis de ambiente.")
    
genai.configure(api_key=api_key)

router = APIRouter(
    prefix="/ai",
    dependencies=[Depends(users.get_current_user)] # Protege todos os endpoints
)

class PromptRequest(BaseModel):
    prompt: str
    context: Optional[str] = "questões de prova"

@router.post("/generate-content")
async def generate_ai_content(request: PromptRequest):
    """
    Endpoint genérico para gerar conteúdo usando Google Gemini.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt não pode ser vazio")

    # Escolha do modelo
    model = genai.GenerativeModel('gemini-flash-latest')

    # Força a resposta em JSON
    config = {
        "response_mime_type": "application/json"
    }

    # Prompt contendo instruções sobre o que fazer
    system_prompt = f"""
    Você é um assistente educacional. Sua tarefa é criar {request.context}.
    Sua resposta DEVE ser um objeto JSON válido seguindo este formato:
    {{
      "sugestoes": [
        {{ "pergunta": "...", "opcoes": ["A", "B", "C", "D"], "correta": "A" }},
        {{ "pergunta": "...", "opcoes": ["A", "B", "C", "D"], "correta": "C" }},
        {{ "pergunta": "...", "tipo": "dissertativa", "resposta_esperada": "..." }}
      ]
    }}
    
    Tópico do usuário: {request.prompt}
    """

    try:
        # Chama API do Gemini
        response = model.generate_content(
            system_prompt,
            generation_config=config
        )

        return {"response": response.text}

    except Exception as e:
        print(f"Erro na API do Gemini: {e}")
        # `response.prompt_feedback` pode conter detalhes se o prompt foi bloqueado
        if hasattr(e, 'prompt_feedback'):
             print(f"Feedback do Prompt: {e.prompt_feedback}")
        raise HTTPException(status_code=500, detail=f"Erro ao contatar o serviço de IA: {e}")