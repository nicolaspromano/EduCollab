from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional
import security
import jwt
from sqlmodel import Session, select
from database import get_session
from models import User, UserBase

router = APIRouter()

# --- SCHEMAS DE ENTRADA/SAÍDA (Mantendo compatibilidade) ---
class UserCreate(UserBase):
    email: str
    password: str
    user_type: str

class UserUpdate(UserBase):
    pass

# --- FUNÇÕES HELPER ---
async def get_current_user(
    token: str = Depends(security.oauth2_scheme),
    session: Session = Depends(get_session)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception

    # Busca no SQLite
    user = session.get(User, email)
    if user is None:
        raise credentials_exception
    
    # Retorna objeto User (SQLModel) que se comporta como dict/Pydantic
    return user

# --- ENDPOINTS ---
@router.post("/register", response_model=security.Token)
async def register_user(
    user_data: UserCreate, 
    session: Session = Depends(get_session)
):
    # Verifica se existe
    existing_user = session.get(User, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="O email já está cadastrado.")

    hashed_password = security.get_password_hash(user_data.password)

    # Cria instância do modelo DB
    db_user = User(
        name=user_data.name,
        phone=user_data.phone,
        email=user_data.email,
        hashed_password=hashed_password,
        user_type=user_data.user_type,
        area=user_data.area,
        level=user_data.level
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    access_token = security.create_access_token(
        data={"sub": db_user.email, "user_type": db_user.user_type}
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user_type": db_user.user_type
    }

@router.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    # Converte para dict para manipular campos
    user_info = current_user.model_dump()
    user_info.pop("hashed_password", None)
    return {"message": "Usuário autenticado com sucesso!", "user_data": user_info}

@router.patch("/users/me")
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    user_data = user_update.model_dump(exclude_unset=True)
    
    # Atualiza campos do objeto atual
    for key, value in user_data.items():
        setattr(current_user, key, value)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    result = current_user.model_dump()
    result.pop("hashed_password", None)
    return result
