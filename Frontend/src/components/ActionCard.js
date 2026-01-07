import React from 'react';
import { Link } from 'react-router-dom';

const ActionCard = ({ icon, title, text, linkTo, buttonText, buttonClass }) => {
    return (
        <div className="col-md-4">
            <div className="card p-4 text-center shadow-sm h-100 d-flex flex-column">
                <i className={`${icon} display-3 mb-3`}></i>
                <h5>{title}</h5>
                <p className="text-muted">{text}</p>
                <Link to={linkTo} className={`btn ${buttonClass} mt-auto`}>{buttonText}</Link>
            </div>
        </div>
    );
};

export default ActionCard;