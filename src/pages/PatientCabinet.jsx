import React, { useState, useEffect, useContext, useRef } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Loader from '../components/Loader';

function PatientCabinet() {
    const { user, updateUser } = useContext(AuthContext);
    const { t } = useLanguage();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBooking, setIsBooking] = useState(false);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', phone: '' });

    const [bookingData, setBookingData] = useState({ doctorId: '', date: '', notes: '' });
    const cabinetRef = useRef(null);

    useEffect(() => {
        fetchData();
        if (user) setProfileData({ firstName: user.firstName, lastName: user.lastName, phone: user.phone });
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true); setError('');
        try {
            const [appRes, docRes] = await Promise.all([
                api.get(`/appointments/patient?t=${Date.now()}`),
                api.get(`/doctors?t=${Date.now()}`)
            ]);
            setAppointments(appRes.data);
            setDoctors(docRes.data);
        } catch (err) { setError('Failed to upload cabinet data.'); } 
        finally { setIsLoading(false); }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!/^\+?[0-9]{10,15}$/.test(profileData.phone)) {
            return alert('Invalid phone format. Please enter + and 10 to 15 digits.');
        }
        try {
            const res = await api.put('/users/profile', profileData);
            updateUser(res.data.user);
            setIsEditingProfile(false);
            alert('Profile successfully updated!');
        } catch (err) { alert('Error updating profile'); }
    };

    const handleFileChange = (e) => setAvatarFile(e.target.files[0]);

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) return alert('Select a file');
        const formData = new FormData(); formData.append('avatar', avatarFile); 
        try {
            const response = await api.post('/upload/avatar', formData);
            const newAvatar = response.data.user.avatarUrl;
            setAvatarUrl(newAvatar); updateUser({ avatarUrl: newAvatar });
            setAvatarFile(null); document.getElementById('avatarInput').value = ''; 
            alert('Avatar updated');
        } catch (err) { alert('Error: ' + (err.response?.data?.message || err.message)); }
    };

    const handleChange = (e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const handleBook = async (e) => {
        e.preventDefault();
        setIsBooking(true);
        try {
            await api.post('/appointments/book', bookingData);
            alert('You have successfully made an appointment!');
            setBookingData({ doctorId: '', date: '', notes: '' });
            fetchData(); 
        } catch (err) { alert(err.response?.data?.message || 'Recording error'); } 
        finally { setIsBooking(false); }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this entry?')) return;
        try {
            await api.delete(`/appointments/${appointmentId}`);
            fetchData(); 
        } catch (err) { alert('Error when canceling recording'); }
    };

    if (isLoading) return <Loader text={t('loadingString')} />;
    if (error) return <div className="container" style={{ color: 'var(--danger)' }}>{error}</div>;

    const currentAvatar = avatarUrl || user?.avatarUrl;
    const selectedDoctorData = doctors.find(doc => doc._id === bookingData.doctorId);

    const getFileUrl = (file) => {
        if (file.startsWith('http')) return file;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : '';
        return `${baseUrl}${file}`;
    };

    return (
        <div className="container" ref={cabinetRef}>
            <h1 className="fade-in">{t('patientCard')}</h1>

            <section className="card profile-section fade-in">
                <div className="avatar-container">
                    {currentAvatar ? <img src={getFileUrl(currentAvatar)} alt="Avatar" /> : <span>No Avatar</span>}
                </div>
                <div style={{ flex: 1 }}>
                    <h2>{t('myProfile')}</h2>
                    {isEditingProfile ? (
                        <form onSubmit={handleProfileUpdate}>
                            <input type="text" placeholder={t('firstName')} value={profileData.firstName} onChange={(e) => setProfileData({...profileData, firstName: e.target.value})} required />
                            <input type="text" placeholder={t('lastName')} value={profileData.lastName} onChange={(e) => setProfileData({...profileData, lastName: e.target.value})} required />
                            <input type="tel" placeholder={t('phone')} value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} required />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="success">{t('save')}</button>
                                <button type="button" className="danger" onClick={() => setIsEditingProfile(false)}>{t('cancel')}</button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <p><strong>{t('firstName')}:</strong> {user?.firstName} {user?.lastName}</p>
                            <p><strong>{t('phone')}:</strong> {user?.phone}</p>
                            <button onClick={() => setIsEditingProfile(true)}>{t('editProfile')}</button>
                        </div>
                    )}

                    <form onSubmit={handleAvatarUpload} style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                        <input id="avatarInput" type="file" accept="image/*" onChange={handleFileChange} />
                        <button type="submit">{t('uploadAvatar')}</button>
                    </form>
                </div>
            </section>

            <section className="card fade-in">
                <h2>{t('makeAppointment')}</h2>
                <form onSubmit={handleBook}>
                    <label>{t('chooseDoctor')}</label>
                    <select name="doctorId" value={bookingData.doctorId} onChange={handleChange} required>
                        <option value="" disabled>-- Choose a specialist --</option>
                        {doctors.map(doc => <option key={doc._id} value={doc._id}>{doc.specialization} - {doc.lastName} {doc.firstName}</option>)}
                    </select>
                    
                    <label>{t('dateTimeSlot')}</label>
                    {selectedDoctorData ? (
                        <select name="date" value={bookingData.date} onChange={handleChange} required>
                            <option value="" disabled>-- Select an available slot --</option>
                            {selectedDoctorData.availableSlots?.length > 0 ? (
                                selectedDoctorData.availableSlots.map(slot => (
                                    <option key={slot} value={slot}>{new Date(slot).toLocaleString()}</option>
                                ))
                            ) : (
                                <option disabled>No available slots for this doctor</option>
                            )}
                        </select>
                    ) : (
                        <select disabled>
                            <option>Select a doctor first</option>
                        </select>
                    )}

                    <label>{t('symptomsOptional')}</label>
                    <textarea name="notes" value={bookingData.notes} onChange={handleChange} rows="3" />

                    <button type="submit" disabled={isBooking}>{isBooking ? t('saving') : t('signUp')}</button>
                </form>
            </section>

            <section className="fade-in">
                <h2>{t('myMedicalCard')}</h2>
                {appointments.length === 0 ? <p>{t('noAppointmentsYet')}</p> : (
                    <ul className="appointment-list">
                        {appointments.map(app => (
                            <li key={app._id}>
                                <h3>{app.doctorId?.lastName} {app.doctorId?.firstName} ({app.doctorId?.specialization})</h3>
                                <p><strong>Date:</strong> {new Date(app.date).toLocaleString()}</p>
                                <p>
                                    <strong>{t('status')}:</strong> 
                                    <span className={`status-badge status-${app.status}`} style={{marginLeft: '10px'}}>{app.status}</span>
                                </p>

                                {app.notes && <p><strong>{t('doctorNotes')}</strong> {app.notes}</p>}
                                
                                {app.files && app.files.length > 0 && (
                                    <div style={{ marginTop: '15px', padding: '15px', background: 'var(--secondary)', borderRadius: 'var(--border-radius)' }}>
                                        <strong>{t('labResults')}</strong>
                                        <ul style={{marginTop: '10px'}}>
                                            {app.files.map((file, index) => (
                                                <li style={{border: 'none', background: 'none', padding: 0, boxShadow: 'none', marginBottom: '5px'}} key={index}>
                                                    <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer">Download Result {index + 1}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {app.status === 'scheduled' && (
                                    <button onClick={() => handleCancel(app._id)} className="danger" style={{ marginTop: '15px' }}>
                                        {t('cancelRecording')}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default PatientCabinet;