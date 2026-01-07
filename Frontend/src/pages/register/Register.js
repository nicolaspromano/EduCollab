import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../apiService.js';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    // Usar useState individual para cada campo (como no seu exemplo)
    const [userType, setUserType] = useState(null); // 'student' ou 'teacher'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [studentLevel, setStudentLevel] = useState('');
    const [teacherArea, setTeacherArea] = useState('');
    const [teacherLevel, setTeacherLevel] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    
    // Estado para controlar o botão e mensagens de erro
    const [isFormValid, setIsFormValid] = useState(false);
    const [error, setError] = useState(null);

    // useEffect para validar o formulário sempre que um campo muda
    useEffect(() => {
        // Validação dos campos comuns
        const commonFieldsValid = name && email && phone && password && agreeTerms;
        
        // Validação dos campos específicos baseados no userType
        let specificFieldsValid = false;
        if (!userType) {
            specificFieldsValid = false; // Precisa escolher um tipo
        } else if (userType === 'student') {
            specificFieldsValid = studentLevel !== ''; // Precisa escolher nível
        } else if (userType === 'teacher') {
            specificFieldsValid = teacherArea !== '' && teacherLevel !== ''; // Precisa escolher área e onde leciona
        }
        
        // Atualiza o estado que controla o botão
        setIsFormValid(commonFieldsValid && specificFieldsValid);

    }, [name, email, phone, password, agreeTerms, userType, studentLevel, teacherArea, teacherLevel]); // Dependências do useEffect

    // handleSubmit adaptado para usar os estados individuais e chamar a API
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Limpa erros anteriores

        if (!isFormValid) {
            // Embora o botão esteja desabilitado, é uma boa prática ter essa checagem
            setError("Por favor, preencha todos os campos obrigatórios corretamente.");
            return;
        }

        // Monta o objeto userData com os estados individuais
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password,
            user_type: userType,
            level: userType === 'student' ? studentLevel : teacherLevel,
            area: userType === 'teacher' ? teacherArea : null,
        };

        try {
            // Chama a API
            const data = await registerUser(userData);

            // Salva o token e redireciona
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_type', data.user_type);

            if (data.user_type === 'teacher') {
                navigate('/professor/home');
            } else {
                navigate('/aluno/home');
            }

        } catch (err) {
            // Mostra o erro da API
            setError(err.message);
        }
    };

    // JSX adaptado para usar os estados individuais no 'value' e 'onChange'
    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">
                   <i className="fas fa-user-plus me-2"></i>
                   Criar Conta no EduCollab
                </h2>

                {error && (
                    <div className="register-error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="form-label fw-bold">Você é:</label>
                    <div className="user-type-selector">
                        <div // Usando div em vez de button para não conflitar com o submit
                            className={`user-type-card ${userType === 'student' ? 'active' : ''}`}
                            onClick={() => setUserType('student')}
                        >
                            <i className="fas fa-user-graduate fa-2x mb-2"></i>
                            <h6>Aluno</h6>
                        </div>
                        <div
                            className={`user-type-card ${userType === 'teacher' ? 'active' : ''}`}
                            onClick={() => setUserType('teacher')}
                        >
                            <i className="fas fa-chalkboard-teacher fa-2x mb-2"></i>
                            <h6>Professor</h6>
                        </div>
                    </div>

                    {/* Campos Comuns */}
                    <div className="row">
                        <div className="col-md-6 mb-3 form-group">
                            <label htmlFor="registerName" className="form-label">Nome Completo</label>
                            <input type="text" id="registerName" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3 form-group">
                            <label htmlFor="registerEmail" className="form-label">Email</label>
                            <input type="email" id="registerEmail" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row">
                         <div className="col-md-6 mb-3 form-group">
                            <label htmlFor="registerPhone" className="form-label">Telefone</label>
                            <input type="tel" id="registerPhone" className="form-control" value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3 form-group">
                            <label htmlFor="registerPassword" className="form-label">Senha</label>
                            <input type="password" id="registerPassword" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    {/* Campos Condicionais de Aluno */}
                    {userType === 'student' && (
                        <div className="conditional-fields show form-group">
                             <label htmlFor="studentLevel" className="form-label fw-bold mb-2">Nível de Ensino</label>
                            <select id="studentLevel" className="form-select" value={studentLevel} onChange={e => setStudentLevel(e.target.value)} required>
                                <option value="">Selecione seu nível</option>
                                <option value="ensino-medio">Ensino Médio</option>
                                <option value="graduacao">Graduação</option>
                            </select>
                        </div>
                    )}

                    {/* Campos Condicionais de Professor */}
                    {userType === 'teacher' && (
                        <div className="conditional-fields show">
                            <h6 className="fw-bold mb-3"><i className="fas fa-chalkboard-teacher me-2"></i>Informações do Professor</h6>
                            <div className="row">
                                <div className="col-md-6 mb-3 form-group">
                                    <label htmlFor="teacherArea" className="form-label">Área de Ensino</label>
                                    <select className="form-select" id="teacherArea" value={teacherArea} onChange={e => setTeacherArea(e.target.value)} required>
                                        <option value="">Selecione sua área</option>
                                        <option value="matematica">Matemática</option>
                                        <option value="portugues">Português</option>
                                        <option value="historia">História</option>
                                        <option value="geografia">Geografia</option>
                                        <option value="biologia">Biologia</option>
                                        <option value="quimica">Química</option>
                                        <option value="fisica">Física</option>
                                        <option value="ingles">Inglês</option>
                                        <option value="artes">Artes</option>
                                        <option value="educacao-fisica">Educação Física</option>
                                        <option value="filosofia">Filosofia</option>
                                        <option value="sociologia">Sociologia</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3 form-group">
                                    <label htmlFor="teacherLevel" className="form-label">Onde leciona</label>
                                    <select className="form-select" id="teacherLevel" value={teacherLevel} onChange={e => setTeacherLevel(e.target.value)} required>
                                        <option value="">Selecione o nível</option>
                                        <option value="ensino-medio">Ensino Médio</option>
                                        <option value="graduacao">Graduação</option>
                                        <option value="ambos">Ambos</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3 form-check mt-3">
                        <input type="checkbox" className="form-check-input" id="agreeTerms" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)} required />
                        <label className="form-check-label" htmlFor="agreeTerms">
                            Concordo com os <a href="#">Termos de Uso</a>
                        </label>
                    </div>

                    {/* O botão agora é controlado pelo estado 'isFormValid' */}
                    <button type="submit" className="btn btn-primary w-100" disabled={!isFormValid}>
                        <i className="fas fa-user-plus me-2"></i>Criar Conta
                    </button>
                </form>

                {/* Links para voltar e login (usando Link do react-router-dom) */}
                <div className="back-link-container">
                    <Link to="/login-selection" className="back-link">Já tenho uma conta? Entre aqui.</Link>
                    <Link to="/" className="back-link">← Voltar para a página inicial</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
