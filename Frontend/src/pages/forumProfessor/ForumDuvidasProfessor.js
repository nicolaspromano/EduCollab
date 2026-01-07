import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { getForumTopics, createForumTopic } from '../../apiService.js';

const ForumDuvidas = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPost, setNewPost] = useState({
        postTitulo: '',
        postConteudo: ''
    });

    // Estados para a API de verificação ortográfica
    const [correcoes, setCorrecoes] = useState([]);
    const [mensagemApi, setMensagemApi] = useState('');
    
    const token = localStorage.getItem('token');

    // Carrega os posts da API (Função original - Intocada)
    const fetchPosts = () => {
        if (!token) return; 
        
        setIsLoading(true);
        getForumTopics(token)
            .then(data => {
                const postsFormatados = data.map(post => ({
                    ...post,
                    autor: post.autor_nome, 
                    data: new Date(post.data).toLocaleDateString('pt-BR') 
                }));
                setPosts(postsFormatados);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar tópicos:", err);
                setError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchPosts();
    }, [token]); 

    // Atualiza o estado e limpa a verificação antiga
    const handleChange = (e) => {
        const { id, value } = e.target;
        setNewPost(prevState => ({ ...prevState, [id]: value }));

        // Limpa as sugestões se o usuário voltar a digitar
        if (id === 'postConteudo') {
            setCorrecoes([]);
            setMensagemApi('');
        }
    };

    // Adiciona post via API e limpa a verificação
    const handleAddPost = (e) => {
        e.preventDefault();
        if (!token) {
            setError("Você precisa estar logado para postar.");
            return;
        }

        const topicData = {
            titulo: newPost.postTitulo,
            conteudo: newPost.postConteudo
        };

        createForumTopic(token, topicData)
            .then(novoTopicoDoServidor => {
                fetchPosts(); 
                
                // Limpa o formulário
                setNewPost({ postTitulo: '', postConteudo: '' });
                
                // Limpa também os resultados da API
                setCorrecoes([]);
                setMensagemApi('');
            })
            .catch(err => {
                console.error("Erro ao criar tópico:", err);
                setError(err.message);
            });
    };

    // Função para chamar a API de verificação ortográfica (LanguageTool)
    const handleVerificarOrtografia = async () => {
        setCorrecoes([]); // Limpa correções antigas
        setMensagemApi('Verificando...');

        const textToCheck = newPost.postConteudo; // Pega o texto do estado

        if (!textToCheck.trim()) {
            setMensagemApi('Digite algo para verificar.');
            return;
        }

        // Prepara os dados para a API externa
        const params = new URLSearchParams();
        params.append('language', 'pt-BR');
        params.append('text', textToCheck);

        try {
            // Chama a API externa gratuita
            const response = await fetch('https://api.languagetool.org/v2/check', {
                method: 'POST',
                body: params
            });

            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            const data = await response.json();

            // Processa a resposta
            if (data.matches.length === 0) {
                setMensagemApi('Nenhum erro de ortografia encontrado!');
            } else {
                setMensagemApi('Foram encontradas sugestões:');
                setCorrecoes(data.matches); // Salva os erros no estado
            }

        } catch (error) {
            console.error('Erro ao verificar ortografia:', error);
            setMensagemApi('Erro ao conectar com o serviço de correção.');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style={{ flex: '1 0 auto', paddingBottom: '80px' }}>
                <nav className="navbar navbar-expand-lg">
                    <div className="container">
                        <Link className="navbar-brand text-white" to="/professor/home">← Voltar</Link>
                        <span className="navbar-text text-white fw-bold">Fórum de Dúvidas</span>
                    </div>
                </nav>

                <div className="container mt-5">
                    <div className="card p-4 shadow-sm mb-5">
                        <h4 className="mb-3"><i className="bi bi-pencil-square me-2"></i> Crie um novo tópico</h4>
                        <form id="postForm" onSubmit={handleAddPost}>
                            <div className="mb-3">
                                <label htmlFor="postTitulo" className="form-label">Título da Dúvida</label>
                                <input type="text" id="postTitulo" className="form-control" placeholder="Seja claro e objetivo" required value={newPost.postTitulo} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="postConteudo" className="form-label">Descreva sua dúvida</label>
                                <textarea id="postConteudo" className="form-control" rows="4" required value={newPost.postConteudo} onChange={handleChange}></textarea>
                            </div>

                            {/* Botão e área de resultados da API externa */}
                            <div className="mb-3">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary w-100" 
                                    onClick={handleVerificarOrtografia}
                                >
                                    Verificar Ortografia
                                </button>
                                
                                {/* Área para exibir os resultados da API */}
                                {mensagemApi && (
                                    <div className="mt-3 p-3 border rounded" style={{backgroundColor: '#f8f9fa'}}>
                                        <p className="fw-bold">{mensagemApi}</p>
                                        {correcoes.length > 0 && (
                                            <ul className="list-group list-group-flush">
                                                {correcoes.map((match, index) => (
                                                    <li className="list-group-item bg-transparent" key={index}>
                                                        {/* Mostra o texto errado em vermelho */}
                                                        <span className="text-danger">"{match.context.text.substring(match.context.offset, match.context.offset + match.context.length)}"</span>
                                                        <br />
                                                        <small>{match.message}</small>
                                                        
                                                        {/* Mostra as sugestões de correção */}
                                                        {match.replacements.length > 0 && (
                                                            <div className="mt-1">
                                                                <small>Sugestões: <span className="text-success fw-bold">{match.replacements.map(r => r.value).join(', ')}</span></small>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Fim da área da API */}

                            <button type="submit" className="btn btn-prim w-100">
                                <i className="bi bi-send-fill me-2"></i> Publicar Tópico
                            </button>
                        </form>
                    </div>

                    <h4 className="mb-3"><i className="bi bi-chat-left-text-fill me-2"></i> Tópicos Recentes</h4>
                    <div className="list-group shadow-sm">
                        {/* Tratamento de isLoading e error */}
                        {isLoading ? (
                            <p className="text-center">Carregando tópicos...</p>
                        ) : error ? (
                            <p className="text-center text-danger">Erro ao carregar tópicos: {error}</p>
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <Link key={post.id} to={`/professor/forumProfessor/topico/${post.id}`} className="list-group-item list-group-item-action flex-column align-items-start">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{post.titulo}</h5>
                                        <small>{post.data}</small>
                                    </div>
                                    <p className="mb-1">Postado por: <strong>{post.autor}</strong></p>
                                    
                                    <small>{post.respostas_count ?? 0} respostas.</small>
                                </Link>
                            ))
                        ) : (
                            <div className="list-group-item">
                                <p className="text-muted text-center my-3">Nenhum tópico foi criado ainda. Seja o primeiro a postar!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ForumDuvidas;
