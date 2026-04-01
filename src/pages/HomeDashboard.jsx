import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function HomeDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalDoctors: 0, appointmentsToday: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [doctorsRes, statsRes] = await Promise.all([
                    api.get('/doctors'),
                    api.get('/stats/summary')
                ]);
                setDoctors(doctorsRes.data);
                setStats(statsRes.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError('Failed to load some dashboard data. Try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div>
            <h1>WELCOME</h1>
            
            <section style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
                <h2>System Statistics</h2>
                <p><strong>Total Doctors:</strong> {stats.totalDoctors}</p>
                <p><strong>Total Patients:</strong> {stats.totalPatients}</p>
                <p><strong>Appointments Today:</strong> {stats.appointmentsToday}</p>
            </section>

            <p>We take care of your health. Choose the right specialist:</p>
            
            {isLoading && <p>Uploading a list of doctors...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!isLoading && !error && doctors.length === 0 && (
                <p>There are no available doctors at the moment.</p>
            )}

            {!isLoading && !error && doctors.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {doctors.map((doctor) => (
                        <li 
                            key={doctor._id} 
                            style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}
                        >
                            <h3>{doctor.firstName} {doctor.lastName}</h3>
                            <p><strong>Specialization:</strong> {doctor.specialization}</p>
                            <p><strong>Experience:</strong> {doctor.experienceYears} лет</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default HomeDashboard;