import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../components/Footer';

function MainLayout() {
    const { user, logout } = useContext(AuthContext);
    const { t, lang, switchLang } = useLanguage();
    const navigate = useNavigate();

    return (
        <div>
            <nav>
                <div className="nav-links">
                    <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{t('main')}</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'patient' && <Link to="/patient">{t('patientCard')}</Link>}
                            {user.role === 'doctor' && <Link to="/doctor">{t('doctorCabinet')}</Link>}
                            {user.role === 'admin' && <Link to="/admin">{t('adminPanel')}</Link>}
                        </>
                    ) : (
                        <>
                            <Link to="/login">{t('login')}</Link>
                            <Link to="/register">{t('register')}</Link>
                        </>
                    )}
                </div>
                
                <div className="nav-links">
                    {user && (
                        <button onClick={() => { logout(); navigate('/login'); }} className="danger" style={{ padding: '6px 12px' }}>
                            {t('logout')} ({user.firstName})
                        </button>
                    )}
                    <select 
                        value={lang} 
                        onChange={(e) => switchLang(e.target.value)}
                        style={{ margin: 0, width: 'auto', padding: '6px 30px 6px 10px' }}
                    >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                    </select>
                </div>
            </nav>
            <main style={{ minHeight: '80vh', paddingBottom: '40px' }}><Outlet /></main>
            <Footer />
        </div>
    );
}

export default MainLayout;