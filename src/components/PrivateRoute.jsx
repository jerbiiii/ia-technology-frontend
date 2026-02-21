import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute – protège une route selon l'authentification et le rôle optionnel.
 *
 * Usage :
 *   <PrivateRoute>                        → login requis (tout utilisateur connecté)
 *   <PrivateRoute role="ROLE_ADMIN">      → login + rôle ADMIN
 *   <PrivateRoute role="ROLE_MODERATEUR"> → login + rôle MODÉRATEUR
 */
const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Attendre l'initialisation de l'auth avant de décider
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                <div className="spinner" style={{
                    width: 36, height: 36,
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#1d4ed8',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
            </div>
        );
    }

    // Non connecté → rediriger vers login en sauvegardant la route voulue
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Rôle requis mais non possédé → accès refusé
    if (role && !user.roles?.includes(role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute;