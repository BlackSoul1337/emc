import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout.jsx';
import RoleRoute from './RoleRoute.jsx';

import HomeDashboard from '../pages/HomeDashboard.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import PatientCabinet from '../pages/PatientCabinet.jsx';
import DoctorCabinet from '../pages/DoctorCabinet.jsx';

const MedicalRecords = () => <div>Medical history</div>;
const BookAppointment = () => <div>Doctor's appointment</div>;
const DoctorSchedule = () => <div>Doctor's schedule</div>;
const PatientSearch = () => <div>Patient Search</div>;
const DoctorsList = () => <div>List of doctors</div>;

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomeDashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="doctors" element={<DoctorsList />} />

                <Route path="patient" element={
                    <RoleRoute allowedRoles={['patient']}>
                        <PatientCabinet />
                    </RoleRoute>
                }>
                    <Route path="records" element={<MedicalRecords />} />
                    <Route path="book" element={<BookAppointment />} />
                </Route>

                <Route path="doctor" element={
                    <RoleRoute allowedRoles={['doctor', 'admin']}>
                        <DoctorCabinet />
                    </RoleRoute>
                }>
                    <Route path="schedule" element={<DoctorSchedule />} />
                    <Route path="patients" element={<PatientSearch />} />
                </Route>

                <Route path="*" element={<div><h1>404</h1><p>Page not found</p></div>} />
            </Route>
        </Routes>
    );
}

export default AppRouter;