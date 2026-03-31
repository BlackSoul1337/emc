import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function PatientCabinet() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [bookingData, setBookingData] = useState({
        doctorId: '',
        date: '',
        notes: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError('');
        try {
            // parallel requests wait a minute this is not a dream
            const [appRes, docRes] = await Promise.all([
                api.get('/appointments/patient'),
                api.get('/doctors')
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

    const handleChange = (e) => {
        setBookingData({
            ...bookingData,
            [e.target.name]: e.target.value
        });
    };

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

    return (
        <div>
            <h1>Patient's personal account</h1>

            <section style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ccc' }}>
                <h2>Make an appointment</h2>
                <form onSubmit={handleBook}>
                    <div>
                        <label>Choose a doctor: *</label>
                        <select 
                            name="doctorId" 
                            value={bookingData.doctorId} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="" disabled>-- Choose a specialist --</option>
                            {doctors.map(doc => (
                                <option key={doc._id} value={doc._id}>
                                    {doc.specialization} - {doc.lastName} {doc.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label>Date and time: *</label>
                        <input 
                            type="datetime-local" 
                            name="date" 
                            value={bookingData.date} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div>
                        <label>Symptoms (optional):</label>
                        <textarea 
                            name="notes" 
                            value={bookingData.notes} 
                            onChange={handleChange} 
                            rows="3"
                        />
                    </div>

                    <button type="submit">Sign up</button>
                </form>
            </section>

            <section>
                <h2>My notes</h2>
                {appointments.length === 0 ? (
                    <p>You don't have any doctor appointments yet.</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {appointments.map(app => (
                            <li key={app._id} style={{ border: '1px solid #aaa', margin: '10px 0', padding: '10px' }}>
                                <p><strong>Doctor:</strong> {app.doctorId?.lastName} {app.doctorId?.firstName} ({app.doctorId?.specialization})</p>
                                <p><strong>Date:</strong> {new Date(app.date)}</p>
                                <p><strong>Status:</strong> {app.status}</p>
                                {app.notes && <p><strong>Your symptoms:</strong> {app.notes}</p>}
                                
                                {app.status === 'scheduled' && (
                                    <button onClick={() => handleCancel(app._id)} style={{ color: 'red' }}>
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