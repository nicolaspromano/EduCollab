import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTopicDetails, addForumReply } from '../../apiService.js';

const TopicoDetalhe = () => {
    const { id } = useParams(); // Pega o 'id' do tópico da URL
    const [topico, setTopico] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [novaRespostaTexto, setNovaRespostaTexto] = useState("");

    const token = localStorage.getItem('token')

    // Função para buscar os detalhes do tópico
    const fetchDetalhes = () => {
        if (!token) return;
        
        setIsLoading(true);
        getTopicDetails(token, id)
            .then(data => {
                // Formata os dados recebidos
                const topicoFormatado = {
                    ...data,
                    autor: data.autor_nome,
                    data: new Date(data.data).toLocaleDateString('pt-BR'),
                    respostas: data.respostas.map(r => ({
                        ...r,
                        autor: r.autor_nome,
                        data: new Date(r.data).toLocaleString('pt-BR')
                    }))
                };
                setTopico(topicoFormatado);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes:", err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchDetalhes();
    }, [id, token]);

    const adicionarResposta = (e) => {
        e.preventDefault();
        if (!token) {
            setError("Você precisa estar logado para responder.");
            return;
        }

        const replyData = {
            texto: novaRespostaTexto
        };

        addForumReply(token, id, replyData)
            .then(novaRespostaDoServidor => {
                // Adiciona a nova resposta à lista (ou recarrega tudo)
                fetchDetalhes(); // Simplesmente recarrega os detalhes
                
                // Limpa o formulário
                setNovaRespostaTexto("");
            })
            .catch(err => {
                console.error("Erro ao adicionar resposta:", err);
                setError("Falha ao enviar resposta: " + err.message);
            });
    };
    
    if (isLoading) {
        return <div className="container mt-5">Carregando tópico...</div>;
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">{error}</div>;
    }

    if (!topico) {
        return <div className="container mt-5">Tópico não encontrado.</div>;
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container">
                    <Link className="navbar-brand text-white" to="/professor/forumProfessor">← Voltar para o Fórum</Link>
                    <span className="navbar-text text-white fw-bold">Detalhes do Tópico</span>
                </div>
            </nav>

            <div className="container mt-5">
                <div className="card shadow-sm mb-4">
                    <div className="card-header d-flex justify-content-between">
                        <h4 className="mb-0">{topico.titulo}</h4>
                    </div>
                    <div className="card-body">
                        <blockquote className="blockquote">
                            <p>{topico.conteudo}</p>
                        </blockquote>
                    </div>
                    <div className="card-footer text-muted">
                        Postado por <strong>{topico.autor}</strong> em {topico.data}
                    </div>
                </div>

               <h5 className="mb-3"><i className="bi bi-chat-dots-fill me-2"></i> Respostas</h5>
                <div className="mb-4">
                    {topico.respostas.length > 0 ? (
                        topico.respostas.map((resposta, index) => (
                            <div className="card card-body bg-light mb-2" key={resposta.id || index}>
                                <p>{resposta.texto}</p>
                                <small className="text-muted">
                                    Respondido por: <strong>{resposta.autor}</strong> em {resposta.data}
                                </small>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">Nenhuma resposta ainda. Seja o primeiro a responder!</p>
                    )}
                </div>

                <div className="card p-4 shadow-sm">
                    <h5 className="mb-3">Deixe sua resposta</h5>
                    <form onSubmit={adicionarResposta}>
                        <div className="mb-3">
                            <label htmlFor="respostaTexto" className="form-label">Sua resposta</label>
                            <textarea 
                                className="form-control" 
                                id="respostaTexto" 
                                rows="3" 
                                required
                                value={novaRespostaTexto}
                                onChange={(e) => setNovaRespostaTexto(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-success">
                            <i className="bi bi-reply-fill me-2"></i> Enviar Resposta
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default TopicoDetalhe;