import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get(`/users/auth?t=${Date.now()}`);
                setUser(response.data.user);
            } catch (error) {
                // Not logged in or token expired
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
        } catch (e) {
            console.error('Logout error', e);
        }
        setUser(null);
    };

    const updateUser = (updatedData) => {
        setUser((prevUser) => ({ ...prevUser, ...updatedData }));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};