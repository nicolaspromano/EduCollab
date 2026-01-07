import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import ActionCard from '../../components/ActionCard';

const ProfessorHome = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <Link to="/professor/perfil" id="nomePerfil" className="navbar-brand mb-0">
                                <i className="fas fa-user-graduate me-2"></i>
                                Painel do Professor
                            </Link>
                        </div>
                        <span className="navbar-text text-white fw-bold">
                            EduCollab - Professor
                        </span>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="text-center mb-4">
                        <h2>Bem-vindo ao Painel do Professor</h2>
                        <p className="text-muted">Escolha uma das funcionalidades abaixo para começar:</p>
                    </div>

                    <div className="row g-4">
                       
                        <ActionCard
                            icon="bi bi-book-half text-primary"
                            title="Sistema de Provas"
                            text="Crie questões, gere provas personalizadas e corrija automaticamente."
                            linkTo="/professor/provas"
                            buttonText="Acessar"
                            buttonClass="btn-prim"
                        />
                        <ActionCard
                            icon="bi bi-chat-dots-fill text-success"
                            title="Fórum de Professores"
                            text="Compartilhe experiências, dúvidas e materiais com colegas."
                            linkTo="/professor/forumProfessor"
                            buttonText="Acessar"
                            buttonClass="btn-success"
                        />
                        <ActionCard
                            icon="bi bi-collection text-warning"
                            title="Banco de Questões"
                            text="Adicione e organize suas questões em um banco centralizado."
                            linkTo="/professor/banco-questoes"
                            buttonText="Acessar"
                            buttonClass="btn-warning text-white"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProfessorHome;