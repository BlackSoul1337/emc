import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function AdminCabinet() {
    const[formData, setFormData] = useState({
        email: '', password: '', firstName: '', lastName: '', phone: '', iin: '', specialization: '', experienceYears: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [appointments, setAppointments] = useState([]);
    const[isLoadingAppts, setIsLoadingAppts] = useState(true);

    useEffect(() => {
        fetchAppointments();
    },[]);

    const fetchAppointments = async () => {
        setIsLoadingAppts(true);
        try {
            const res = await api.get(`/appointments?t=${Date.now()}`);
            setAppointments(res.data);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        } finally {
            setIsLoadingAppts(false);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');
        try {
            await api.post('/admin/create-doctor', formData);
            setMessage('Doctor successfully created!');
            setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', iin: '', specialization: '', experienceYears: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating doctor');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this record?')) return;
        try {
            await api.delete(`/appointments/${id}`);
            alert('Record deleted successfully');
            fetchAppointments();
        } catch (err) {
            alert('Error deleting the record');
        }
    };

    return (
        <div>
            <h1>Admin Panel</h1>
            
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <section style={{ padding: '20px', border: '1px solid #ccc', minWidth: '350px', flex: 1 }}>
                    <h2>Register a new Doctor</h2>
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input name="email" type="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
                        <input name="password" type="password" placeholder="Password *" value={formData.password} onChange={handleChange} required />
                        <input name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required />
                        <input name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} required />
                        <input name="iin" placeholder="IIN *" value={formData.iin} onChange={handleChange} required />
                        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                        <input name="specialization" placeholder="Specialization (e.g. Cardiologist) *" value={formData.specialization} onChange={handleChange} required />
                        <input name="experienceYears" type="number" placeholder="Experience (Years)" value={formData.experienceYears} onChange={handleChange} required />
                        <button type="submit">Create Doctor</button>
                    </form>
                </section>

                <section style={{ padding: '20px', border: '1px solid #ccc', flex: 2, minWidth: '400px' }}>
                    <h2>Manage All Appointments</h2>
                    {isLoadingAppts ? <p>Loading appointments...</p> : (
                        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #333' }}>
                                    <th style={{ padding: '8px' }}>Date</th>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(app => (
                                    <tr key={app._id} style={{ borderBottom: '1px solid #ccc' }}>
                                        <td style={{ padding: '8px' }}>{new Date(app.date).toLocaleString()}</td>
                                        <td>{app.patientId?.lastName} {app.patientId?.firstName}</td>
                                        <td>{app.doctorId?.lastName} ({app.doctorId?.specialization})</td>
                                        <td>
                                            <span style={{ 
                                                color: app.status === 'completed' ? 'green' : app.status === 'cancelled' ? 'red' : 'blue',
                                                fontWeight: 'bold'
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td>
                                            {(app.status === 'completed' || app.status === 'cancelled') ? (
                                                <button onClick={() => handleDelete(app._id)} style={{ color: '#fff', backgroundColor: 'red', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                                                    Delete
                                                </button>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#666' }}>Cannot delete active</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {appointments.length === 0 && (
                                    <tr><td colSpan="5" style={{ padding: '10px' }}>No appointments in the system.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AdminCabinet;