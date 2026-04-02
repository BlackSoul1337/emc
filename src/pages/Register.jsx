import React, { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Register() {
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', iin: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useLanguage();
    const formRef = useRef(null);

    useEffect(() => {
        // pure CSS animations used
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.post('/users/register', formData);
            setMessage('Registration successful! Check your email to activate your account.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <div className="card fade-in" ref={formRef} style={{ width: '100%', maxWidth: '500px' }}>
                <h2 style={{ textAlign: 'center', borderBottom: 'none' }}>{t('registerApp')}</h2>
                {message && <p style={{ color: 'var(--success)', textAlign: 'center' }}>{message}</p>}
                {error && <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <input name="email" type="email" placeholder={t('email')} value={formData.email} onChange={handleChange} required />
                    <input name="password" type="password" placeholder={t('password')} value={formData.password} onChange={handleChange} required />
                    <input name="firstName" placeholder={t('firstName')} value={formData.firstName} onChange={handleChange} required />
                    <input name="lastName" placeholder={t('lastName')} value={formData.lastName} onChange={handleChange} required />
                    <input name="iin" placeholder={t('iin')} value={formData.iin} onChange={handleChange} required />
                    <input name="phone" placeholder={t('phone')} value={formData.phone} onChange={handleChange} required />
                    <button type="submit" style={{ marginTop: '10px' }}>{t('registerApp')}</button>
                </form>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <span>{t('alreadyHaveAccount')} </span>
                    <Link to="/login">{t('loginToAccount')}</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;