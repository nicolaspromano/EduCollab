from sqlmodel import SQLModel
from database import engine

# Importa os modelos para que o SQLModel os reconheça no metadata
from models import User, Question, Topic, Reply

def create_db_and_tables():
    print("Criando banco de dados e tabelas...")
    SQLModel.metadata.create_all(engine)
    print("Banco de dados criado com sucesso: database.db")

if __name__ == "__main__":
    create_db_and_tables()
