import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

// Export nommé du contexte
export const AuthContext = createContext();

// Fournisseur du contexte
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        setUser(data);
        setIsAuthenticated(true);
        return data;
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const register = async (nom, prenom, email, password) => {
        return AuthService.register(nom, prenom, email, password);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};