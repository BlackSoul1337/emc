import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const { t } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();
    
    const queryParams = new URLSearchParams(location.search);
    const activated = queryParams.get('activated');

    const formRef = useRef(null);

    useEffect(() => {
        // pure CSS animations used
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/users/login', { email, password });
            login(response.data.user);
            if (response.data.user.role === 'patient') navigate('/patient');
            else if (response.data.user.role === 'doctor') navigate('/doctor');
            else if (response.data.user.role === 'admin') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div className="card fade-in" ref={formRef} style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', borderBottom: 'none' }}>{t('login')}</h2>
                {activated && <p style={{ color: 'var(--success)', textAlign: 'center' }}>Account activated successfully! You can login now.</p>}
                {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" style={{ marginTop: '10px' }}>{t('login')}</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <span>{t('doNotHaveAccount')} </span>
                    <Link to="/register">{t('registerApp')}</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;