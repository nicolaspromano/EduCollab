// Tenta pegar do process.env (padrão Create React App)
// Se não encontrar, usa o localhost como fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Função para fazer Login.
 */
export const loginUser = async (email, password) => {
    // Formata os dados para o padrão de formulário
    const params = new URLSearchParams();
    params.append('username', email);     // O FastAPI espera 'username', não 'email'
    params.append('password', password);

    // Faz a requisição POST para /token
    const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
    });

    // Se a resposta não for OK (ex: erro 401), lança um erro
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha no login');
    }

    // Retorna os dados (token)
    return await response.json();
};

/**
 * Função para fazer o Cadastro.
 */
export const registerUser = async (userData) => {
    console.log("Tentando cadastrar:", userData); // Log para debug

    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Falha no cadastro:", errorData.detail); // Log do erro
        throw new Error(errorData.detail || 'Falha no cadastro');
    }

    const data = await response.json();
    console.log("Cadastro bem-sucedido, token recebido:", data);
    return data;
};

/**
 * Função para buscar os dados do usuário logado (endpoint protegido).
 */
export const getUserProfile = async (token) => {
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
            // Envia o Token de acesso no cabeçalho de Autorização
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        // Se o token for inválido ou expirar, o erro será 401
        throw new Error(errorData.detail || 'Sessão inválida');
    }

    return await response.json();

};


/**
 * Função para atualizar dados do usuário 
 */
export const updateUserProfile = async (token, profileData) => {   
    const response = await fetch(`${API_URL}/users/me`, {
        method: 'PATCH',
        headers: {
            // Envia o Token de acesso no cabeçalho de Autorização
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao atualizar perfil');
    }

    return await response.json();
};

/**
 * Função para buscar questões
 */
export const getQuestions = async (token) => {
    const response = await fetch(`${API_URL}/questions`, {
        method: 'GET',
        headers: {
            // Envia o Token de acesso no cabeçalho de Autorização
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao buscar questões');
    }

    return await response.json();
}

/**
 * Função para criar questão
 */
export const createQuestion = async (token, question) => {
    const response = await fetch(`${API_URL}/question`, {
        method: 'POST',
        headers: {
            // Envia o Token de acesso no cabeçalho de Autorização
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao criar questão');
    }

    return await response.json();
}

/**
 * Função para deletar questão
 */
export const deleteQuestion = async (token, id) => {
    const response = await fetch(`${API_URL}/question/${id}`, {
        method: 'DELETE',
        headers: {
            // Envia o Token de acesso no cabeçalho de Autorização
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao criar questão');
    }

    return await response.json();
}

/**
 * Função para buscar todos os tópicos do fórum
 */
export const getForumTopics = async (token) => {
    const response = await fetch(`${API_URL}/forum/topics`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao buscar tópicos');
    }
    return await response.json();
};

/**
 * Função para criar um novo tópico
 */
export const createForumTopic = async (token, topicData) => {
    // topicData deve ser um objeto: { titulo: "...", conteudo: "..." }
    const response = await fetch(`${API_URL}/forum/topics`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao criar tópico');
    }
    return await response.json();
};

/**
 * Função para buscar os detalhes de um tópico
 */
export const getTopicDetails = async (token, topicId) => {
    const response = await fetch(`${API_URL}/forum/topics/${topicId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao buscar detalhes do tópico');
    }
    return await response.json();
};

/**
 * Função para adicionar uma resposta a um tópico
 */
export const addForumReply = async (token, topicId, replyData) => {
    // replyData deve ser um objeto: { texto: "..." }
    const response = await fetch(`${API_URL}/forum/topics/${topicId}/replies`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(replyData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao adicionar resposta');
    }
    return await response.json();
};

/**
 * Função para chamar o assistente de IA
 */
export const getAICompletion = async (token, promptText, contextText) => {
    const response = await fetch(`${API_URL}/ai/generate-content`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            prompt: promptText,
            context: contextText
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao gerar conteúdo');
    }
    
    const data = await response.json();
    // A resposta da IA (que é um JSON string) está dentro de data.response
    return JSON.parse(data.response); 
};