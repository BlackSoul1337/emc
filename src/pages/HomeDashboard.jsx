import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function HomeDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get('/doctors');
                setDoctors(response.data);
            } catch (err) {
                console.error('Error when uploading doctors:', err);
                setError('The list of specialists could not be uploaded. Try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div>
            <h1>WELCOME</h1>
            <p>We take care of your health. Choose the right specialist:</p>

            <h2>Our doctors</h2>
            
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