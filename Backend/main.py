from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import FastAPI
from contextlib import asynccontextmanager
import os

# Importa o engine e os modelos para o SQLModel reconhecer as tabelas
from database import engine
from sqlmodel import SQLModel

# Importa modelos aqui para que sejam registrados no metadata
from models import User, Question, Topic, Reply 

# Carrega variáveis de ambiente
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Cria as tabelas automaticamente na inicialização (se não existirem)
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(
    title="EduCollab API",
    description="API para o projeto EduCollab",
    lifespan=lifespan
)

# Importa rotas
import forum
import gemini
import questions
import security
import users

# Lê a variável ALLOWED_ORIGINS. Se não existir, usa "*" (libera tudo) como fallback.
origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],    
)

app.include_router(users.router)
app.include_router(security.router)
app.include_router(questions.router)
app.include_router(forum.router)
app.include_router(gemini.router)

@app.get("/")
def read_root():
    return {"message": "API do EduCollab em funcionamento"}