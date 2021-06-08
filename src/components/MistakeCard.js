import React from 'react';


const MistakeCard = ({mistakes}) => {
    return(
        <div className="mistake-card">
            <div className="icon-wrapper">
                <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="text-wrapper">
                <h2 id="mistake">{mistakes.message}</h2>
                <h3>Χρησιμοποιήστε: {mistakes.replacements[0].value}</h3>
            </div>
        </div>
    )
};

export default MistakeCard;