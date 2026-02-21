import { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Charger l'utilisateur depuis localStorage au démarrage
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await AuthService.login(email, password);
        setUser(AuthService.getCurrentUser());
        return data;
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const register = (nom, prenom, email, password) =>
        AuthService.register(nom, prenom, email, password);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export { AuthContext };
export default AuthContext;