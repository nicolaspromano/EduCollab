import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
            <div className="container">
                <a className="navbar-brand" href="/">
                    <i className="fas fa-graduation-cap me-2"></i>EduCollab
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item dropdown">
                            <button className="btn btn-menu-custom" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="fas fa-bars me-2"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end p-2">
                                <li className="nav-item">
                                    <a className="nav-link" href="#recursos">Recursos</a>
                                </li>
                                <li>
                                    <Link to="/login-selection" className="dropdown-item btn btn-outline-primary">
                                        <i className="fas fa-sign-in-alt me-1"></i> Entrar
                                    </Link>
                                </li>
                                <li>
                                    <button className="dropdown-item btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#registerModal">
                                        <i className="fas fa-user-plus me-1"></i> Cadastrar
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;