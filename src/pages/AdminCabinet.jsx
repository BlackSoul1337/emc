import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

function AdminCabinet() {
    const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '', iin: '', specialization: '', experienceYears: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [appointments, setAppointments] = useState([]);
    const [isLoadingAppts, setIsLoadingAppts] = useState(true);
    const [requireEmail, setRequireEmail] = useState(false);
    const { t } = useLanguage();
    const adminRef = useRef(null);

    useEffect(() => {
        fetchAppointments();
        fetchSettings();
    },[]);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/admin/settings');
            setRequireEmail(res.data.requireEmailAuth);
        } catch(err) { console.error('Error fetching settings'); }
    };

    const toggleEmailAuth = async () => {
        try {
            const res = await api.post('/admin/settings/toggle-email-auth');
            setRequireEmail(res.data.requireEmailAuth);
            alert(res.data.message);
        } catch(err) { alert('Error toggling setting'); }
    };

    const fetchAppointments = async () => {
        setIsLoadingAppts(true);
        try {
            const res = await api.get(`/appointments?t=${Date.now()}`);
            setAppointments(res.data);
        } catch (err) { console.error('Error fetching appointments'); } finally { setIsLoadingAppts(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.post('/admin/create-doctor', formData);
            setMessage('Doctor successfully created!');
            setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', iin: '', specialization: '', experienceYears: '' });
        } catch (err) { setError(err.response?.data?.message || 'Error creating doctor'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            fetchAppointments(); 
        } catch (err) { alert('Error deleting the record'); }
    };

    return (
        <div className="container" ref={adminRef}>
            <h1 className="fade-in">{t('adminPanel')}</h1>
            
            <section className="card fade-in">
                <h3 style={{ marginTop: 0 }}>{t('systemStats')} - Settings</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span>
                        <strong>{t('requireEmailAuth')}:</strong> 
                        <span className={`status-badge status-${requireEmail ? 'completed' : 'cancelled'}`} style={{marginLeft: '10px'}}>
                            {requireEmail ? 'ON' : 'OFF'}
                        </span>
                    </span>
                    <button onClick={toggleEmailAuth} className={requireEmail ? 'danger' : 'success'}>
                        {requireEmail ? t('turnOffEmailAuth') : t('turnOnEmailAuth')}
                    </button>
                </div>
            </section>

            <div className="dashboard-grid">
                <section className="card fade-in">
                    <h2>{t('createNewDoctor')}</h2>
                    {message && <p style={{ color: 'var(--success)' }}>{message}</p>}
                    {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
                    
                    <form onSubmit={handleSubmit}>
                        <input name="email" type="email" placeholder={`${t('email')} *`} value={formData.email} onChange={handleChange} required />
                        <input name="password" type="password" placeholder={`${t('password')} *`} value={formData.password} onChange={handleChange} required />
                        <input name="firstName" placeholder={`${t('firstName')} *`} value={formData.firstName} onChange={handleChange} required />
                        <input name="lastName" placeholder={`${t('lastName')} *`} value={formData.lastName} onChange={handleChange} required />
                        <input name="iin" placeholder={`${t('iin')} *`} value={formData.iin} onChange={handleChange} required />
                        <input name="phone" placeholder={t('phone')} value={formData.phone} onChange={handleChange} required />
                        <input name="specialization" placeholder={`${t('specialization')} *`} value={formData.specialization} onChange={handleChange} required />
                        <input name="experienceYears" type="number" placeholder={t('expYears')} value={formData.experienceYears} onChange={handleChange} required />
                        <button type="submit">{t('save')}</button>
                    </form>
                </section>

                <section className="card fade-in" style={{ gridColumn: 'span 2' }}>
                    <h2>{t('allAppointments')}</h2>
                    {isLoadingAppts ? <Loader /> : (
                        <div style={{overflowX: 'auto'}}>
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                        <th style={{ padding: '12px 8px' }}>{t('dateTable')}</th>
                                        <th>{t('patientTable')}</th>
                                        <th>{t('doctorTable')}</th>
                                        <th>{t('status')}</th>
                                        <th>{t('actionTable')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map(app => (
                                        <tr key={app._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '12px 8px' }}>{new Date(app.date).toLocaleString()}</td>
                                            <td>{app.patientId?.lastName} {app.patientId?.firstName}</td>
                                            <td>{app.doctorId?.lastName}</td>
                                            <td>
                                                <span className={`status-badge status-${app.status}`}>{t(app.status)}</span>
                                            </td>
                                            <td>
                                                {(app.status === 'completed' || app.status === 'cancelled') ? (
                                                    <button onClick={() => handleDelete(app._id)} className="danger" style={{ padding: '5px 10px', fontSize: '0.9rem' }}>{t('deleteAction')}</button>
                                                ) : <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>{t('cannotDeleteActive')}</span>}
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && <tr><td colSpan="5" style={{ padding: '15px' }}>{t('noApptsInSystem')}</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminCabinet;