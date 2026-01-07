import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer'; 
import { getUserProfile, updateUserProfile } from '../../apiService.js'

const AlunoPerfil = () => {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState({
        name: '',
        phone: '',
        email: '',
        level: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token')
                const data = await getUserProfile(token);
                setPerfil(data.user_data);
            } catch (error) {
                console.error("Erro ao buscar informação do usuário:", error);
                alert("Não foi possível carregar suas informações de usuário.");
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPerfil(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSubmit = (e) => {
        const updateUser = async () => {
            try {
                const token = localStorage.getItem('token')
                await updateUserProfile(token, perfil)
            } catch (error) {
                console.error("Erro ao atualizar informação do usuário:", error);
                alert("Não foi possível atualizar suas informações de usuário.");
            }
        };

        updateUser();
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <div style={{ flex: '1 0 auto', paddingBottom: '80px' }}>
                    <nav className="navbar navbar-expand-lg">
                        <div className="container">
                            <Link className="navbar-brand text-white" to="/aluno/home">← Voltar</Link>
                        </div>
                    </nav>

                    <div className="container mt-5">
                        <h3 className="mb-4">Editar Perfil do Aluno</h3>
                        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                            <div className="mb-3">
                                <label htmlFor="nome" className="form-label">Nome</label>
                                <input type="text" id="name" className="form-control" placeholder={perfil.name} required value={perfil.name} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="telefone" className="form-label">Telefone</label>
                                <input type="tel" id="phone" className="form-control" placeholder={perfil.phone} value={perfil.phone} onChange={handleChange} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">E-mail</label>
                                <output type="email" id="email" className="form-control">{perfil.email}</output>
                            </div>
                            <div className="col-md-6 mb-3 form-group">
                                    <label htmlFor="teacherLevel" className="form-label">Onde leciona</label>
                                    <select className="form-select" id="level" required value={perfil.level} onChange={handleChange}>
                                        <option value="">Selecione o nível</option>
                                        <option value="ensino-medio">Ensino Médio</option>
                                        <option value="graduacao">Graduação</option>
                                    </select>
                            </div>
                            <button type="submit" className="btn btn-prim">Salvar Alterações</button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default AlunoPerfil;