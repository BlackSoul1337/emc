import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!credentials.email || !credentials.password) {
            setError('Enter your email and pass');
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post('/users/login', credentials);
            
            const { token, user } = response.data;
            
            login(user, token);
            
            navigate('/');
            
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('Auth err. Check you details');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2>Sign in</h2>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={credentials.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Pass</label>
                    <input type="password" name="password" value={credentials.password} onChange={handleChange} required />
                </div>
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sign in...' : 'Login'}
                </button>
            </form>
            
            <p>No account? <Link to="/register">Register</Link></p>
        </div>
    );
}

export default Login;