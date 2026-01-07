import React from 'react';


const QuestaoCard = ({ questao, children }) => {
    return (
        <div className="col-md-6">
            <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                   
                    <span className="badge bg-primary mb-2 align-self-start">{questao.materia}</span>
                    <p className="card-text fw-bold">{questao.enunciado}</p>

                    
                    <div className="mt-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestaoCard;