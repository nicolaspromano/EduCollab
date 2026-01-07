from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import List
from sqlmodel import Session, select
import users
from database import get_session
from models import Question, QuestionBase, AnswerOptions

router = APIRouter()

class QuestionCreate(QuestionBase):
    pass

class QuestionDisplay(QuestionBase):
    id: int

@router.get("/questions", response_model=List[QuestionDisplay])
async def get_questions(
    current_user: dict = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    # Retorna todas as questões do BD
    questions = session.exec(select(Question)).all()
    return questions

@router.post("/question", response_model=QuestionDisplay, status_code=status.HTTP_201_CREATED)
async def create_question(
    question_data: QuestionCreate,
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.user_type != 'teacher':
        raise HTTPException(status_code=404, detail="Apenas professores podem criar questões")

    # SQLModel lida com o mapeamento para JSON automaticamente via models.py
    new_question = Question.model_validate(question_data)
    
    session.add(new_question)
    session.commit()
    session.refresh(new_question)
    
    return new_question

@router.delete("/question/{question_id}", response_model=QuestionDisplay)
async def delete_question(
    question_id: int,
    current_user: users.User = Depends(users.get_current_user),
    session: Session = Depends(get_session)
):
    if current_user.user_type != 'teacher':
        raise HTTPException(status_code=404, detail="Apenas professores podem deletar questões")

    question = session.get(Question, question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Questão não encontrada")

    session.delete(question)
    session.commit()
    return question
