import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSelection.css';
import { loginUser } from '../../apiService.js';

const LoginSelection = () => {
    const navigate = useNavigate();

    // Criar "estados" para os campos de formulário e erros
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Para mostrar erros da API

    // Login do professor
    const handleLoginProfessor = async (e) => {
        e.preventDefault();
        setError(null); // Limpa erros antigos

        try {
            // Chamar a API de login
            const data = await loginUser(email, password);

            // Verificar se o usuário logado é um professor
            if (data.user_type === 'teacher') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_type', data.user_type);
                
                navigate('/professor/home');
            } else {
                setError('Este é um login de Aluno. Por favor, use o outro botão.');
            }
        } catch (err) {
            // Se a API der erro (401), mostrar a mensagem
            setError(err.message); // Ex: "Email ou senha incorretos"
        }
    };

    // Login do aluno
    const handleLoginAluno = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Chamar a API de login
            const data = await loginUser(email, password);

            // Verificar se o usuário logado é um aluno
            if (data.user_type === 'student') {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('user_type', data.user_type);
                navigate('/aluno/home');
            } else {
                setError('Este é um login de Professor. Por favor, use o outro botão.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-selection-container">
            <div className="selection-box">
                <h2 className="selection-title">
                    <i className="fas fa-graduation-cap me-2"></i>Acesse o EduCollab
                </h2>
                
                {error && (
                    <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}
                
                <form className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        {/* Conectar os inputs ao estado */}
                        <input 
                            type="email" 
                            id="email" 
                            className="form-control" 
                            placeholder="digite seu email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="form-control" 
                            placeholder="digite sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                    
                    <div className="button-group">
                        <button onClick={handleLoginProfessor} className="login-button professor-btn">
                            <i className="fas fa-chalkboard-teacher me-2"></i>
                            Entrar como Professor
                        </button>
                        <button onClick={handleLoginAluno} className="login-button student-btn">
                            <i className="fas fa-user-graduate me-2"></i>
                            Entrar como Aluno
                        </button>
                    </div>
                </form>

                <a href="/" className="back-link">← Voltar para a página inicial</a>
            </div>
        </div>
    );
};

export default LoginSelection;
