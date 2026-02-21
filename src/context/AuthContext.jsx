import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * AuthContext
 *
 * Le backend renvoie après /api/auth/signin :
 * { token, type, id, email, nom, prenom, role }
 * où role est une STRING : "ADMIN" | "MODERATEUR" | "UTILISATEUR"
 *
 * On stocke cet objet tel quel dans localStorage sous la clé "user".
 * Toutes les vérifications de rôle utilisent user.role (string).
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Initialiser depuis localStorage au démarrage
        try {
            const stored = localStorage.getItem('user');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    // ── Helpers de rôle ──────────────────────────────────────────
    // user.role est une string "MODERATEUR", "ADMIN", "UTILISATEUR"
    const isAdmin = user?.role === 'ADMIN';
    const isModerator = user?.role === 'MODERATEUR' || user?.role === 'ADMIN';
    const isAuthenticated = !!user;

    // ── Login ────────────────────────────────────────────────────
    const login = async (email, password) => {
        const response = await api.post('/auth/signin', { email, password });
        const userData = response.data;
        // { token, type, id, email, nom, prenom, role }
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    // ── Logout ───────────────────────────────────────────────────
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // ── Token refresh : si localStorage a changé dans un autre onglet
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'user') {
                try {
                    const updated = e.newValue ? JSON.parse(e.newValue) : null;
                    setUser(updated);
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
            user,
            isAuthenticated,
            isAdmin,
            isModerator,
            login,
            logout,
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

export default AuthContext;