import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function DoctorCabinet() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        status: '',
        notes: ''
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get('/appointments/doctor');
            setAppointments(response.data);
        } catch (err) {
            console.error('Schedule loading error:', err);
            setError('The list of patients could not be uploaded.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (app) => {
        setEditingId(app._id);
        setEditForm({
            status: app.status,
            notes: app.notes || '' 
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ status: '', notes: '' });
    };

    const handleFormChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async (id) => {
        try {
            await api.put(`/appointments/${id}`, editForm);
            alert('The reception data has been successfully updated!');
            setEditingId(null);
            fetchAppointments();
        } catch (err) {
            alert('Error saving data');
        }
    };

    if (isLoading) return <div>Loading the schedule...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h1>Doctor's Office</h1>
            <h2>My schedule</h2>

            {appointments.length === 0 ? (
                <p>You don't have any appointments yet.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {appointments.map(app => (
                        <li key={app._id} style={{ border: '1px solid #0056b3', margin: '15px 0', padding: '15px' }}>
                            <h3>Patient: {app.patientId?.lastName} {app.patientId?.firstName}</h3>
                            <p><strong>IIN:</strong> {app.patientId?.iin}</p>
                            <p><strong>Phone:</strong> {app.patientId?.phone}</p>
                            <p><strong>Date and Time:</strong> {new Date(app.date)}</p>
                            
                            {editingId !== app._id ? (
                                <>
                                    <p><strong>Status:</strong> {app.status}</p>
                                    <p><strong>Symptoms / Conclusion:</strong> {app.notes || 'No records'}</p>
                                    
                                    <button onClick={() => handleEditClick(app)}>
                                        Fill in the protocol / Change the status
                                    </button>
                                </>
                            ) : (
                                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f9f9f9' }}>
                                    <h4>Editing the reception</h4>
                                    
                                    <div style={{ marginBottom: '10px' }}>
                                        <label>Status: </label>
                                        <select name="status" value={editForm.status} onChange={handleFormChange}>
                                            <option value="scheduled">Scheduled</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '10px' }}>
                                        <label>Conclusion / Recommendations:</label><br />
                                        <textarea 
                                            name="notes" 
                                            value={editForm.notes} 
                                            onChange={handleFormChange}
                                            rows="4" 
                                            style={{ width: '100%' }}
                                        />
                                    </div>

                                    <button onClick={() => handleSave(app._id)} style={{ marginRight: '10px', color: 'green' }}>
                                        Save
                                    </button>
                                    <button onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DoctorCabinet;