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
    const[searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAppointments();
    },[]);

    const fetchAppointments = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get(`/appointments/doctor?t=${Date.now()}`);
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

    const handleFormChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

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

    const handleFileUpload = async (appointmentId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            await api.post(`/upload/lab-result/${appointmentId}`, formData);
            alert('The analysis result is attached');
            fetchAppointments(); 
        } catch (err) {
            console.error('File Upload Error:', err);
            alert('Error: ' + (err.response?.data?.message || err.message));
        }
    };

    const filteredAppointments = appointments.filter(app => {
        const patientName = `${app.patientId?.lastName} ${app.patientId?.firstName}`.toLowerCase();
        const patientIin = app.patientId?.iin || '';
        const query = searchQuery.toLowerCase();
        return patientName.includes(query) || patientIin.includes(query);
    });

    const upcomingAppointments = filteredAppointments.filter(app => app.status === 'scheduled');
    const historyAppointments = filteredAppointments.filter(app => app.status !== 'scheduled');

    if (isLoading) return <div>Loading the schedule...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    const renderAppointmentCard = (app) => (
        <li key={app._id} style={{ border: '1px solid #0056b3', margin: '15px 0', padding: '15px', opacity: app.status !== 'scheduled' ? 0.7 : 1 }}>
            <h3>Patient: {app.patientId?.lastName} {app.patientId?.firstName}</h3>
            <p><strong>IIN:</strong> {app.patientId?.iin}</p>
            <p><strong>Phone:</strong> {app.patientId?.phone}</p>
            <p><strong>Date and Time:</strong> {new Date(app.date).toLocaleString()}</p>
            
            {editingId !== app._id ? (
                <>
                    <p><strong>Status:</strong> <span style={{ color: app.status === 'scheduled' ? 'blue' : 'gray', fontWeight: 'bold' }}>{app.status}</span></p>
                    
                    {app.files && app.files.length > 0 && (
                        <div style={{ padding: '10px', backgroundColor: '#e9f5ff', marginBottom: '10px' }}>
                            <strong>Attached Lab Results / Files:</strong>
                            <ul style={{ margin: '5px 0' }}>
                                {app.files.map((file, index) => (
                                    <li key={index}>
                                        <a href={`http://localhost:3000${file}`} target="_blank" rel="noopener noreferrer">
                                            Open File {index + 1}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{ marginTop: '10px', marginBottom: '15px', padding: '10px', border: '1px dashed #0056b3' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}><strong>Upload result / scan:</strong></label>
                        <input 
                            type="file" 
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    handleFileUpload(app._id, file);
                                    e.target.value = '';
                                }
                            }} 
                        />
                    </div>
                    
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
                        <textarea name="notes" value={editForm.notes} onChange={handleFormChange} rows="4" style={{ width: '100%' }} />
                    </div>
                    <button onClick={() => handleSave(app._id)} style={{ marginRight: '10px', color: 'green' }}>Save</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            )}
        </li>
    );

    return (
        <div>
            <h1>Doctor's Office</h1>
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                <label><strong>Patient search:</strong> </label>
                <input 
                    type="text" 
                    placeholder="Enter LastName or IIN" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '5px', width: '250px' }}
                />
            </div>

            <h2>Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
                <p>No active scheduled appointments.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {upcomingAppointments.map(renderAppointmentCard)}
                </ul>
            )}

            <h2 style={{ marginTop: '40px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>History of Appointments</h2>
            {historyAppointments.length === 0 ? (
                <p>No completed or cancelled appointments.</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {historyAppointments.map(renderAppointmentCard)}
                </ul>
            )}
        </div>
    );
}

export default DoctorCabinet;