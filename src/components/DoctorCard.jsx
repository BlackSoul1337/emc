import React from 'react';

function DoctorCard({ doctor }) {
    return (
        <article style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            <h3>{doctor.firstName} {doctor.lastName}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Experience:</strong> {doctor.experienceYears} years</p>
        </article>
    );
}

export default DoctorCard;