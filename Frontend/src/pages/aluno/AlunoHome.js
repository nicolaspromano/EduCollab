import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import ActionCard from '../../components/ActionCard'; 

const AlunoHome = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container d-flex justify-content-between align-items-center">
                         <div className="d-flex align-items-center">
                            <Link to="/aluno/perfil" id="nomePerfil" className="navbar-brand mb-0">
                                <i className="fas fa-user-graduate me-2"></i>
                                Painel do Aluno
                            </Link>
                        </div>
                        <span className="navbar-text text-white fw-bold">
                            EduCollab
                        </span>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="text-center mb-4">
                        <h2>Bem-vindo(a) à sua área de estudos!</h2>
                        <p className="text-muted">Escolha uma das funcionalidades abaixo para começar:</p>
                    </div>

                    <div className="row g-4 justify-content-center">

                        <ActionCard
                            icon="bi bi-collection text-warning"
                            title="Banco de Questões"
                            text="Teste seus conhecimentos com as questões preparadas pelos professores."
                            linkTo="/aluno/banco-questoes"
                            buttonText="Acessar"
                            buttonClass="btn-warning text-white"
                        />

                        
                        <ActionCard
                            icon="bi bi-chat-dots-fill text-success"
                            title="Fórum de Dúvidas"
                            text="Tire suas dúvidas e compartilhe conhecimento com outros alunos."
                            linkTo="/aluno/forumAluno"
                            buttonText="Acessar"
                            buttonClass="btn-success"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AlunoHome;