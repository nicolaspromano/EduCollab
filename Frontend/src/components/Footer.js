import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h5><i className="fas fa-graduation-cap me-2"></i>EduCollab</h5>
                        <p className="mb-0">Transformando a educação através da colaboração.</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                        <p className="mb-0">&copy; 2025 EduCollab. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};


export default Footer;
