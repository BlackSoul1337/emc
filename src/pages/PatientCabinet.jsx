import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function PatientCabinet() {
    const { user, updateUser } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState('');

    const [bookingData, setBookingData] = useState({
        doctorId: '',
        date: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    },[]);

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const [appRes, docRes] = await Promise.all([
                api.get(`/appointments/patient?t=${Date.now()}`),
                api.get(`/doctors?t=${Date.now()}`)
            ]);
            setAppointments(appRes.data);
            setDoctors(docRes.data);
        } catch (err) {
            console.error('Data upload error:', err);
            setError('Failed to upload cabinet data.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => setAvatarFile(e.target.files[0]);

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        if (!avatarFile) return alert('Select a file');

        const formData = new FormData();
        formData.append('avatar', avatarFile); 

        try {
            const response = await api.post('/upload/avatar', formData);
            alert('Avatar updated');
            
            const newAvatar = response.data.user.avatarUrl + `?t=${Date.now()}`;
            setAvatarUrl(newAvatar);
            updateUser({ avatarUrl: newAvatar });
            
            setAvatarFile(null);
            document.getElementById('avatarInput').value = ''; 
        } catch (err) {
            console.error('Avatar upload err:', err);
            alert('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleChange = (e) => setBookingData({ ...bookingData, [e.target.name]: e.target.value });

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/appointments/book', bookingData);
            alert('You have successfully made an appointment!');
            setBookingData({ doctorId: '', date: '', notes: '' });
            fetchData(); 
        } catch (err) {
            alert(err.response?.data?.message || 'Recording error');
        }
    };

    const handleCancel = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this entry?')) return;
        try {
            await api.delete(`/appointments/${appointmentId}`);
            fetchData(); 
        } catch (err) {
            alert('Error when canceling recording');
        }
    };

    if (isLoading) return <div>Loading the cabinet...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    const currentAvatar = avatarUrl || user?.avatarUrl;

    return (
        <div>
            <h1>Patient's personal account</h1>

            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {currentAvatar ? (
                        <img 
                            src={currentAvatar.includes('http') ? currentAvatar : `http://localhost:3000${currentAvatar}`} 
                            alt="Avatar" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <span>No Avatar</span>
                    )}
                </div>
                <div>
                    <h2>My Profile</h2>
                    <form onSubmit={handleAvatarUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input id="avatarInput" type="file" accept="image/*" onChange={handleFileChange} />
                        <button type="submit">Upload new Avatar</button>
                    </form>
                </div>
            </section>

            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc' }}>
                <h2>Make an appointment</h2>
                <form onSubmit={handleBook}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Choose a doctor: *</label>
                        <select name="doctorId" value={bookingData.doctorId} onChange={handleChange} required style={{ display: 'block', width: '100%' }}>
                            <option value="" disabled>-- Choose a specialist --</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.specialization} - {doc.lastName} {doc.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '10px' }}>
                        <label>Date and time: *</label>
                        <input type="datetime-local" name="date" value={bookingData.date} onChange={handleChange} required style={{ display: 'block', width: '100%' }} />
                    </div>

                    <div style={{ marginBottom: '10px' }}>
                        <label>Symptoms (optional):</label>
                        <textarea name="notes" value={bookingData.notes} onChange={handleChange} rows="3" style={{ display: 'block', width: '100%' }} />
                    </div>

                    <button type="submit">Sign up</button>
                </form>
            </section>

            <section>
                <h2>My Medical Card / Notes</h2>
                {appointments.length === 0 ? (
                    <p>You don't have any doctor appointments yet.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {appointments.map(app => (
                            <li key={app._id} style={{ border: '1px solid #aaa', margin: '10px 0', padding: '15px' }}>
                                <p><strong>Doctor:</strong> {app.doctorId?.lastName} {app.doctorId?.firstName} ({app.doctorId?.specialization})</p>
                                <p><strong>Date:</strong> {new Date(app.date).toLocaleString()}</p>
                                <p><strong>Status:</strong> {app.status}</p>

                                {app.notes && <p><strong>Doctor notes / Your symptoms:</strong> {app.notes}</p>}
                                
                                {app.files && app.files.length > 0 && (
                                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#e9f5ff' }}>
                                        <strong>Lab Results / Scans from Doctor:</strong>
                                        <ul>
                                            {app.files.map((file, index) => (
                                                <li key={index}>
                                                    <a href={`http://localhost:3000${file}`} target="_blank" rel="noopener noreferrer">
                                                        Download Result {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {app.status === 'scheduled' && (
                                    <button onClick={() => handleCancel(app._id)} style={{ color: 'red', marginTop: '10px' }}>
                                        Cancel recording
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