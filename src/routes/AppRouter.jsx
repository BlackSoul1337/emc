import React from 'react';
import { Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout.jsx';
import RoleRoute from './RoleRoute.jsx';

import HomeDashboard from '../pages/HomeDashboard.jsx';
import Login from '../pages/Login.jsx';
import Register from '../pages/Register.jsx';
import PatientCabinet from '../pages/PatientCabinet.jsx';
import DoctorCabinet from '../pages/DoctorCabinet.jsx';
import AdminCabinet from '../pages/AdminCabinet.jsx';

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomeDashboard />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route path="patient" element={
                    <RoleRoute allowedRoles={['patient']}>
                        <PatientCabinet />
                    </RoleRoute>
                } />

                <Route path="doctor" element={
                    <RoleRoute allowedRoles={['doctor', 'admin']}>
                        <DoctorCabinet />
                    </RoleRoute>
                } />

                <Route path="admin" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <AdminCabinet />
                    </RoleRoute>
                } />

                <Route path="*" element={
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <h1>404</h1>
                        <p>Ouch! There is no such page.</p>
                    </div>
                } />
            </Route>
        </Routes>
    );
}

export default AppRouter;