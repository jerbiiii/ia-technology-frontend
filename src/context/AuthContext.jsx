import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

export const AuthContext = createContext();

// ✅ Hook useAuth manquant - utilisé dans Dashboard, Profile, ModeratorPanel...
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

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