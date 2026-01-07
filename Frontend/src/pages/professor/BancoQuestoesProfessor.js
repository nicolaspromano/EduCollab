import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import QuestaoCard from '../../components/QuestaoCard';
import { getQuestions, createQuestion, deleteQuestion, getAICompletion } from '../../apiService.js';

const BancoQuestoesProfessor = () => {
    const [questoes, setQuestoes] = useState([]);
    const [novaQuestao, setNovaQuestao] = useState({
        materia: '',
        enunciado: '',
        alternativas: ['', '', '', ''],
        resposta: '',
    });

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setNovaQuestao(prevState => ({ ...prevState, [id]: value }));
    };

    const handleAlternativaChange = (index, value) => {
        const novasAlternativas = [...novaQuestao.alternativas];
        novasAlternativas[index] = value;
        setNovaQuestao(prevState => ({ ...prevState, alternativas: novasAlternativas }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // A API recebe a nova questão
            const token = localStorage.getItem('token')
            const data = await createQuestion(token, novaQuestao); 
            
            // Retorna a questão salva (com seu ID do banco de dados)
            const questaoSalva = data; 

            // Adiciona a nova questão ao estado local (evita re-buscar tudo)
            setQuestoes(prevQuestoes => [...prevQuestoes, questaoSalva]);
            
            alert('Questão salva com sucesso!');
            setNovaQuestao({ materia: '', enunciado: '', alternativas: ['', '', '', ''], resposta: '' });
        
        } catch (error) {
            console.error("Erro ao salvar questão:", error);
            alert("Erro ao salvar. Tente novamente.");
        }
    };

    const removerQuestao = async (idParaRemover) => {
        if (window.confirm('Tem certeza que deseja excluir esta questão?')) {
            try {
                const token = localStorage.getItem('token')
                await deleteQuestion(token, idParaRemover); 
                
                // Remove a questão do estado local
                const questoesAtualizadas = questoes.filter(q => q.id !== idParaRemover);
                setQuestoes(questoesAtualizadas);

            } catch (error) {
                console.error("Erro ao excluir questão:", error);
                alert("Erro ao excluir. Tente novamente.");
            }
        }
    };

    const [aiPrompt, setAiPrompt] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [aiError, setAiError] = useState(null);
    
    const token = localStorage.getItem('token')

    const handleAIGenerate = (e) => {
        e.preventDefault();
        setAiLoading(true);
        setAiResult(null);
        setAiError(null);

        const context = "3 questões de múltipla escolha (A, B, C, D) com gabarito";
        
        getAICompletion(token, aiPrompt, context)
            .then(data => {
                console.log("IA Gerou:", data.sugestoes);
                setAiResult(data.sugestoes); // data.sugestoes (do JSON da IA)
            })
            .catch(err => {
                setAiError(err.message);
            })
            .finally(() => {
                setAiLoading(false);
            });
    };

    const handleUseSuggestion = (sugestao) => {
        const questaoFormatada = {
            materia: aiPrompt, 
            
            enunciado: sugestao.pergunta,
            
            // Garante 4 alternativas, mesmo que a IA mande menos
            alternativas: [
                sugestao.opcoes[0] || '',
                sugestao.opcoes[1] || '',
                sugestao.opcoes[2] || '',
                sugestao.opcoes[3] || ''
            ],
            
            resposta: sugestao.correta 
        };

        setNovaQuestao(questaoFormatada);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto', paddingBottom: '80px' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container">
                        <Link className="navbar-brand text-white" to="/professor/home">← Voltar</Link>
                        <span className="navbar-text text-white fw-bold">Banco de Questões</span>
                    </div>
                </nav>

                <div className="container mt-5">
                    
                    <div className="card p-4 shadow-sm mb-5">
                        <h4 className="mb-3">
                            <i className="bi bi-plus-circle-fill me-2"></i> Adicionar Nova Questão
                        </h4>
                        <form onSubmit={handleSubmit}>
                            
                            <div className="mb-3">
                                <label htmlFor="materia" className="form-label">Matéria</label>
                                <input type="text" id="materia" className="form-control" placeholder="Ex: Matemática" required value={novaQuestao.materia} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="enunciado" className="form-label">Enunciado</label>
                                <textarea id="enunciado" className="form-control" rows="3" placeholder="Digite o enunciado da questão" required value={novaQuestao.enunciado} onChange={handleChange}></textarea>
                            </div>
                            {novaQuestao.alternativas.map((alt, index) => (
                                <div className="input-group mb-2" key={index}>
                                    <span className="input-group-text">{String.fromCharCode(65 + index)}</span>
                                    <input type="text" className="form-control" placeholder={`Alternativa ${String.fromCharCode(65 + index)}`} required value={alt} onChange={(e) => handleAlternativaChange(index, e.target.value)} />
                                </div>
                            ))}
                            <div className="mb-3">
                                <label htmlFor="resposta" className="form-label">Resposta Correta</label>
                                <select id="resposta" className="form-select" required value={novaQuestao.resposta} onChange={handleChange}>
                                    <option value="">Selecione a correta...</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="C">C</option>
                                    <option value="D">D</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-prim w-100">
                                <i className="bi bi-check-circle-fill me-2"></i> Salvar Questão
                            </button>
                        </form>
                    </div>
                    
                    <div className="card p-4 shadow-sm mb-5">
                        <h4 className="mb-3">
                            <i className="bi bi-robot me-2"></i> 
                            Assistente de Questões (IA)
                        </h4>
                        <form onSubmit={handleAIGenerate}>
                            <div className="mb-3">
                                <label htmlFor="aiPrompt" className="form-label">Descreva o tópico</label>
                                <input 
                                    type="text" 
                                    id="aiPrompt" 
                                    className="form-control" 
                                    placeholder="Ex: Revolução Francesa" 
                                    required 
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={aiLoading}>
                                {aiLoading ? "Gerando..." : "Gerar Sugestões de Questões"}
                            </button>
                        </form>

                        {aiLoading && <div className="text-center mt-3">Carregando...</div>}
                        {aiError && <div className="alert alert-danger mt-3">{aiError}</div>}
                        
                        {aiResult && (
                            <div className="mt-4">
                                <h5>Sugestões Geradas:</h5>
                                {aiResult.map((sugestao, index) => (
                                    <div className="card bg-light mb-2" key={index}>
                                        <div className="card-body">
                                            <p><strong>Pergunta:</strong> {sugestao.pergunta}</p>
                                            {sugestao.opcoes && (
                                                <ul>
                                                    {sugestao.opcoes.map((opt, i) => (
                                                        <li key={i} style={{ color: sugestao.correta === opt ? 'green' : 'inherit' }}>
                                                            {opt}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => handleUseSuggestion(sugestao)} 
                                            >
                                                Usar esta questão
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <h4 className="mb-3">
                        <i className="bi bi-collection-fill me-2"></i> Questões Cadastradas
                    </h4>
                    <div className="row g-4">
                        {questoes.length === 0 ? (
                            <p className="text-muted col-12">Nenhuma questão cadastrada ainda.</p>
                        ) : (
                            
                            questoes.map((q, index) => (
                                <QuestaoCard key={index} questao={q}>
                                    
                                    <ul className="list-unstyled">
                                        {q.alternativas.map((alt, i) => (
                                            <li key={i}><strong>{String.fromCharCode(65 + i)}:</strong> {alt}</li>
                                        ))}
                                    </ul>
                                    <p className="text-success mt-auto">Resposta Correta: {q.resposta}</p>
                                    <div className="card-footer bg-transparent border-top-0 text-end p-0 pt-2">
                                        <button className="btn btn-sm btn-danger" onClick={() => removerQuestao(index)}>
                                            <i className="bi bi-trash-fill me-1"></i> Excluir
                                        </button>
                                    </div>
                                </QuestaoCard>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default BancoQuestoesProfessor;