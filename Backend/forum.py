from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import List
from sqlmodel import Session, select
import users
from database import get_session
from models import Topic, Reply

router = APIRouter(prefix="/forum")

# --- SCHEMAS (para interface frontend) ---
class ReplyBase(BaseModel):
    texto: str

class ReplyDisplay(ReplyBase):
    id: str
    autor_nome: str
    data: datetime

class TopicBase(BaseModel):
    titulo: str
    conteudo: str

class TopicCreate(TopicBase):
    pass

class TopicDisplay(TopicBase):
    id: str
    autor_nome: str
    data: datetime
    respostas: List[ReplyDisplay] = []

# --- ENDPOINTS ---

@router.get("/topics", response_model=List[TopicDisplay])
async def get_all_topics(
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    # Filtra tópicos com base no tipo de usuário (simulando a lógica original de listas separadas)
    context = 'teacher' if current_user.user_type == 'teacher' else 'student'
    
    # Busca tópicos ordenados por data
    statement = select(Topic).where(Topic.context_type == context).order_by(Topic.data.desc())
    topics = session.exec(statement).all()
    
    # O SQLModel fará o lazy loading das respostas, mas para o schema Pydantic, precisamos garantir
    # que o campo 'respostas' seja preenchido. O output model cuida da conversão se os nomes baterem.
    # Mapeamos respostas_db (DB) para respostas (Schema) manualmente se necessário, 
    # mas aqui usamos list comprehension para formatar.
    
    result = []
    for t in topics:
        # Converte respostas do DB para Schema
        replies_display = [
            ReplyDisplay(
                id=r.id, autor_nome=r.autor_nome, data=r.data, texto=r.texto
            ) for r in t.respostas_db
        ]
        
        result.append(TopicDisplay(
            id=t.id,
            titulo=t.titulo,
            conteudo=t.conteudo,
            autor_nome=t.autor_nome,
            data=t.data,
            respostas=replies_display
        ))
        
    return result

@router.post("/topics", response_model=TopicDisplay)
async def create_new_topic(
    topic_data: TopicCreate,
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    autor_nome = current_user.name
    context = 'teacher' if current_user.user_type == 'teacher' else 'student'
    
    new_topic = Topic(
        id=f"topico-{int(datetime.now().timestamp())}",
        titulo=topic_data.titulo,
        conteudo=topic_data.conteudo,
        autor_nome=autor_nome,
        data=datetime.now(),
        context_type=context
    )
    
    session.add(new_topic)
    session.commit()
    session.refresh(new_topic)
    
    # Retorno compatível com Schema
    return TopicDisplay(
        id=new_topic.id,
        titulo=new_topic.titulo,
        conteudo=new_topic.conteudo,
        autor_nome=new_topic.autor_nome,
        data=new_topic.data,
        respostas=[]
    )

@router.get("/topics/{topic_id}", response_model=TopicDisplay)
async def get_topic_details(
    topic_id: str,
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    context = 'teacher' if current_user.user_type == 'teacher' else 'student'
    
    # Busca garantindo que pertença ao contexto correto
    statement = select(Topic).where(Topic.id == topic_id, Topic.context_type == context)
    topic = session.exec(statement).first()
    
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")
    
    replies_display = [
        ReplyDisplay(id=r.id, autor_nome=r.autor_nome, data=r.data, texto=r.texto) 
        for r in topic.respostas_db
    ]

    return TopicDisplay(
        id=topic.id,
        titulo=topic.titulo,
        conteudo=topic.conteudo,
        autor_nome=topic.autor_nome,
        data=topic.data,
        respostas=replies_display
    )

@router.post("/topics/{topic_id}/replies", response_model=ReplyDisplay)
async def add_reply_to_topic(
    topic_id: str,
    reply_data: ReplyBase,
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    context = 'teacher' if current_user.user_type == 'teacher' else 'student'
    statement = select(Topic).where(Topic.id == topic_id, Topic.context_type == context)
    topic = session.exec(statement).first()
    
    if not topic:
        raise HTTPException(status_code=404, detail="Tópico não encontrado")

    autor_nome = current_user.name
    
    new_reply = Reply(
        id=f"resp-{int(datetime.now().timestamp())}",
        topic_id=topic_id,
        texto=reply_data.texto,
        autor_nome=autor_nome,
        data=datetime.now()
    )
    
    session.add(new_reply)
    session.commit()
    session.refresh(new_reply)
    
    return ReplyDisplay(
        id=new_reply.id,
        autor_nome=new_reply.autor_nome,
        data=new_reply.data,
        texto=new_reply.texto
    )
