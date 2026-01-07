import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import QuestaoCard from '../../components/QuestaoCard'; 
import { getQuestions } from '../../apiService.js';

const BancoQuestoesAluno = () => {
    const [questoes, setQuestoes] = useState([]);
    const [filtroMateria, setFiltroMateria] = useState('');
    const [respostas, setRespostas] = useState({});
    const [feedbacks, setFeedbacks] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestoes = async () => {
            try {
                const token = localStorage.getItem('token')
                const data = await getQuestions(token); 
                setQuestoes(data);
            } catch (error) {
                console.error("Erro ao buscar questões:", error);
                alert("Não foi possível carregar suas questões.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestoes();
    }, []);

    const questoesFiltradas = questoes.filter(q =>
        q.materia.toLowerCase().includes(filtroMateria.toLowerCase())
    );

    const handleRespostaChange = (questaoIndex, resposta) => {
        setRespostas(prev => ({ ...prev, [questaoIndex]: resposta }));
    };

    const verificarResposta = (questaoIndex) => {
        const questao = questoes[questaoIndex];
        const respostaAluno = respostas[questaoIndex];

        if (!respostaAluno) {
            setFeedbacks(prev => ({ ...prev, [questaoIndex]: { tipo: 'warning', texto: 'Selecione uma alternativa!' } }));
            return;
        }

        if (respostaAluno === questao.resposta) {
            setFeedbacks(prev => ({ ...prev, [questaoIndex]: { tipo: 'success', texto: 'Parabéns! Resposta Correta!' } }));
        } else {
            setFeedbacks(prev => ({ ...prev, [questaoIndex]: { tipo: 'danger', texto: `Ops! Resposta Incorreta. A resposta certa é a ${questao.resposta}.` } }));
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto', paddingBottom: '80px' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container">
                        <Link className="navbar-brand text-white" to="/aluno/home">← Voltar</Link>
                        <span className="navbar-text text-white fw-bold">Banco de Questões</span>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="text-center mb-5">
                        <h2 className="display-5 fw-bold">Teste seus conhecimentos!</h2>
                        <p className="lead text-muted">Resolva as questões cadastradas pelos professores e prepare-se para as provas.</p>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Filtrar por matéria..."
                                value={filtroMateria}
                                onChange={(e) => setFiltroMateria(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row g-4">
                        {questoesFiltradas.length > 0 ? (
                            questoesFiltradas.map((q, index) => {
                                const originalIndex = questoes.findIndex(item => item.enunciado === q.enunciado);
                                const feedback = feedbacks[originalIndex];

                                
                                return (
                                    <QuestaoCard key={originalIndex} questao={q}>
                                                                                <div>
                                            {q.alternativas.map((alt, i) => {
                                                const altLetra = String.fromCharCode(65 + i);
                                                return (
                                                    <div className="form-check" key={i}>
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name={`questao-${originalIndex}`}
                                                            id={`q-${originalIndex}-alt-${i}`}
                                                            value={altLetra}
                                                            onChange={() => handleRespostaChange(originalIndex, altLetra)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`q-${originalIndex}-alt-${i}`}>
                                                            {altLetra}) {alt}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button className="btn btn-sm btn-success mt-3" onClick={() => verificarResposta(originalIndex)}>
                                            <i className="bi bi-check2-circle"></i> Verificar
                                        </button>
                                        {feedback && (
                                            <div className={`alert alert-${feedback.tipo} p-2 mt-2`}>
                                                {feedback.texto}
                                            </div>
                                        )}
                                    </QuestaoCard>
                                );
                            })
                        ) : (
                            <p className="text-muted col-12">Nenhuma questão encontrada para o filtro selecionado.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BancoQuestoesAluno;