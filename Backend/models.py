from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from enum import Enum

# --- ENUMS ---
class AnswerOptions(str, Enum):
    A = "A"
    B = "B"
    C = "C"
    D = "D"

# --- USUÁRIOS ---
class UserBase(SQLModel):
    name: str
    phone: str
    area: Optional[str] = None
    level: Optional[str] = None

class User(UserBase, table=True):
    # 'email' é chave primária lógica ou unique index
    email: str = Field(primary_key=True, index=True) 
    hashed_password: str
    user_type: str  # 'student' ou 'teacher'

# --- QUESTÕES ---
class QuestionBase(SQLModel):
    materia: str
    enunciado: str
    # SQLite não tem array nativo, usamos JSON type do SQLAlchemy
    alternativas: List[str] = Field(sa_column=Column(JSON))
    resposta: AnswerOptions

class Question(QuestionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

# --- FÓRUM ---
class Reply(SQLModel, table=True):
    id: str = Field(primary_key=True)
    topic_id: str = Field(foreign_key="topic.id")
    texto: str
    autor_nome: str
    data: datetime
    
    # Relacionamento reverso
    topic: Optional["Topic"] = Relationship(back_populates="respostas_db")

class Topic(SQLModel, table=True):
    id: str = Field(primary_key=True)
    titulo: str
    conteudo: str
    autor_nome: str
    data: datetime
    # Campo extra para persistir a lógica de separação (professor vs aluno)
    context_type: str 

    # Relacionamento: Um tópico tem várias respostas
    respostas_db: List[Reply] = Relationship(back_populates="topic", sa_relationship_kwargs={"cascade": "all, delete"})
