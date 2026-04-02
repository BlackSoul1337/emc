import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

function DoctorCabinet() {
    const { user } = useContext(AuthContext);
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [slots, setSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ status: '', notes: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const cabinetRef = useRef(null);

    useEffect(() => {
        fetchAppointments();
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await api.get(`/users/auth?t=${Date.now()}`);
            setSlots(res.data.user.availableSlots ||[]);
        } catch(err) { console.error(err); }
    };

    const fetchAppointments = async () => {
        setIsLoading(true); setError('');
        try {
            const response = await api.get(`/appointments/doctor?t=${Date.now()}`);
            setAppointments(response.data);
        } catch (err) { setError('The list of patients could not be uploaded.'); } 
        finally { setIsLoading(false); }
    };

    const handleAddSlot = async () => {
        if (!newSlot) return;
        try {
            const res = await api.post(`/doctors/${user.id}/slots`, { slot: newSlot });
            setSlots(res.data);
            setNewSlot('');
            alert('Slot generated successfully');
        } catch (err) { alert(err.response?.data?.message || 'Error adding slot'); }
    };

    const handleRemoveSlot = async (slot) => {
        try {
            const res = await api.delete(`/doctors/${user.id}/slots/${slot}`);
            setSlots(res.data);
        } catch (err) { alert('Error removing slot'); }
    };

    const handleEditClick = (app) => { setEditingId(app._id); setEditForm({ status: app.status, notes: app.notes || '' }); };
    const handleCancelEdit = () => { setEditingId(null); setEditForm({ status: '', notes: '' }); };
    const handleFormChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

    const handleSave = async (id) => {
        try {
            await api.put(`/appointments/${id}`, editForm);
            alert('The reception data has been successfully updated!');
            setEditingId(null);
            fetchAppointments();
        } catch (err) { alert('Error saving data'); }
    };

    const handleFileUpload = async (appointmentId, file) => {
        const formData = new FormData(); formData.append('file', file);
        try {
            await api.post(`/upload/lab-result/${appointmentId}`, formData);
            alert('The analysis result is attached');
            fetchAppointments(); 
        } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
    };

    const filteredAppointments = appointments.filter(app => {
        const patientName = `${app.patientId?.lastName} ${app.patientId?.firstName}`.toLowerCase();
        const patientIin = app.patientId?.iin || '';
        const query = searchQuery.toLowerCase();
        return patientName.includes(query) || patientIin.includes(query);
    });

    const upcomingAppointments = filteredAppointments.filter(app => app.status === 'scheduled');
    const historyAppointments = filteredAppointments.filter(app => app.status !== 'scheduled');

    const getFileUrl = (file) => file.startsWith('http') ? file : `http://localhost:3000${file}`;

    if (isLoading) return <Loader text={t('loadingSchedule')} />;
    if (error) return <div className="container" style={{ color: 'var(--danger)' }}>{error}</div>;

    const renderAppointmentCard = (app) => (
        <li key={app._id} className="fade-in" style={{ opacity: app.status !== 'scheduled' ? 0.7 : 1 }}>
            <h3>Patient: {app.patientId?.lastName} {app.patientId?.firstName}</h3>
            <p><strong>IIN:</strong> {app.patientId?.iin}</p>
            <p><strong>Phone:</strong> {app.patientId?.phone}</p>
            <p><strong>Date and Time:</strong> {new Date(app.date).toLocaleString()}</p>
            
            {editingId !== app._id ? (
                <>
                    <p>
                        <strong>{t('status')}:</strong> 
                        <span className={`status-badge status-${app.status}`} style={{marginLeft: '10px'}}>{t(app.status)}</span>
                    </p>
                    
                    {app.files && app.files.length > 0 && (
                        <div style={{ padding: '15px', backgroundColor: 'var(--secondary)', marginBottom: '15px', borderRadius: 'var(--border-radius)' }}>
                            <strong>{t('labResults')}</strong>
                            <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                                {app.files.map((file, index) => (
                                    <li key={index} style={{border: 'none', background: 'none', padding: 0, boxShadow: 'none', margin: '5px 0'}}>
                                        <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer">Open File {index + 1}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: '15px', marginBottom: '15px', padding: '15px', border: '1px dashed var(--border)', borderRadius: 'var(--border-radius)' }}>
                        <label style={{ display: 'block', marginBottom: '10px' }}><strong>{t('attachResult')}</strong></label>
                        <input type="file" onChange={(e) => { const file = e.target.files[0]; if (file) { handleFileUpload(app._id, file); e.target.value = ''; } }} />
                    </div>
                    
                    <p><strong>{t('conclusion')}</strong> {app.notes || 'No records'}</p>
                    <button onClick={() => handleEditClick(app)}>{t('fillProtocol')}</button>
                </>
            ) : (
                <div style={{ marginTop: '15px', padding: '20px', backgroundColor: 'var(--background)', borderRadius: 'var(--border-radius)' }}>
                    <h4>{t('editingReception')}</h4>
                    <label>{t('status')}: </label>
                    <select name="status" value={editForm.status} onChange={handleFormChange}>
                        <option value="scheduled">{t('scheduled')}</option>
                        <option value="completed">{t('completed')}</option>
                        <option value="cancelled">{t('cancelled')}</option>
                    </select>
                    
                    <label>{t('conclusion')}</label>
                    <textarea name="notes" value={editForm.notes} onChange={handleFormChange} rows="4" />
                    
                    <div style={{display: 'flex', gap: '10px'}}>
                        <button onClick={() => handleSave(app._id)} className="success">{t('save')}</button>
                        <button onClick={handleCancelEdit} className="danger">{t('cancel')}</button>
                    </div>
                </div>
            )}
        </li>
    );

    return (
        <div className="container" ref={cabinetRef}>
            <h1 className="fade-in">{t('doctorCabinet')}</h1>

            <section className="card fade-in">
                <h2>{t('manageSchedule')}</h2>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <input type="datetime-local" value={newSlot} onChange={(e) => setNewSlot(e.target.value)} min={new Date().toISOString().slice(0, 16)} style={{marginBottom: 0}} />
                    <button onClick={handleAddSlot}>{t('generateSlot')}</button>
                </div>
                <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', listStyleType: 'none', padding: 0 }}>
                    {slots.map(s => (
                        <li key={s} style={{ backgroundColor: 'var(--background)', padding: '8px 15px', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {new Date(s).toLocaleString()}
                            <button onClick={() => handleRemoveSlot(s)} style={{ padding: '0 5px', color: 'var(--danger)', background: 'transparent', width: 'auto' }}>X</button>
                        </li>
                    ))}
                    {slots.length === 0 && <p style={{ marginTop: '10px' }}>{t('noSlots')}</p>}
                </ul>
            </section>
            
            <div className="card fade-in" style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px' }}><strong>{t('patientSearch')}</strong> </label>
                <input type="text" placeholder={t('enterLastNameOrIIN')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

            <h2 className="fade-in">{t('upcomingAppointments')}</h2>
            {upcomingAppointments.length === 0 ? <p className="fade-in">{t('noScheduled')}</p> : (
                <ul className="appointment-list">{upcomingAppointments.map(renderAppointmentCard)}</ul>
            )}

            <h2 className="fade-in" style={{ marginTop: '40px' }}>{t('historyAppointments')}</h2>
            {historyAppointments.length === 0 ? <p className="fade-in">{t('noHistory')}</p> : (
                <ul className="appointment-list">{historyAppointments.map(renderAppointmentCard)}</ul>
            )}
        </div>
    );
}

export default DoctorCabinet;