import React from 'react';

function Loader({ text }) {
    return (
        <div className="spinner-container fade-in">
            <div className="spinner"></div>
            <div>{text || 'Loading...'}</div>
        </div>
    );
}

export default Loader;
