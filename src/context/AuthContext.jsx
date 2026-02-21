import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATEUR' || user?.role === 'ADMIN';
    const isAuthenticated = !!user;

    const login = async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        const userData = response.data;
        // ✅ FIX: stocker le token séparément pour l'intercepteur api.js
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    // ✅ FIX: fonction register manquante (Register.jsx l'utilise)
    const register = async (nom, prenom, email, password) => {
        const response = await api.post('/auth/signup', { nom, prenom, email, password });
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'user') {
                try {
                    setUser(e.newValue ? JSON.parse(e.newValue) : null);
                } catch {
                    setUser(null);
                }
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, isAdmin, isModerator,
            login, logout, register,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

// ✅ FIX: export named pour Register.jsx et Login.jsx qui utilisent useContext(AuthContext)
export { AuthContext };
export default AuthContext;