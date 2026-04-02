import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Shield, Mail } from 'lucide-react';

function Footer() {
    const { t } = useLanguage();
    
    return (
        <footer style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '40px 20px', marginTop: 'Auto' }}>
            <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '30px' }}>
                <div style={{ flex: '1 1 250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <Activity size={24} />
                        <h2 style={{ color: 'white', margin: 0, borderBottom: 'none', padding: 0 }}>EMC System</h2>
                    </div>
                    <p style={{ opacity: 0.8 }}>Advanced Electronic Medical Cards System prioritizing your health and security.</p>
                </div>
                
                <div style={{ flex: '1 1 200px' }}>
                    <h3 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>{t('main')}</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, opacity: 0.8, lineHeight: '1.8' }}>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('policy')}</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('tos')}</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>{t('support')}</a></li>
                    </ul>
                </div>

                <div style={{ flex: '1 1 250px' }}>
                    <h3 style={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Contact</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: 0.8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16}/> support@emcsystem.com</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={16}/> Certified Medical Infrastructure</span>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.6 }}>
                &copy; {new Date().getFullYear()} EMC System. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;
