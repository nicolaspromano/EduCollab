from sqlmodel import create_engine, Session
from typing import Generator

# Configuração do SQLite
sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# check_same_thread=False é necessário para SQLite com FastAPI
connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def get_session() -> Generator[Session, None, None]:
    """Dependência para injetar a sessão do BD nos endpoints."""
    with Session(engine) as session:
        yield session
