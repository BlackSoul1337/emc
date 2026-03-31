import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function MainLayout() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div>
            <header style={{ borderBottom: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
                <nav style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <Link to="/">Main</Link>
                    
                    {user ? (
                        <>
                            {user.role === 'patient' && <Link to="/patient">Medical card</Link>}
                            {user.role === 'doctor' && <Link to="/doctor">Doctor`s cabinet</Link>}
                            <button onClick={handleLogout}>Logout ({user.firstName})</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;