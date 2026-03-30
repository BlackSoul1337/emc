import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RoleRoute({ children, allowedRoles }) {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return <div>verification of access rights...</div>; 
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default RoleRoute;