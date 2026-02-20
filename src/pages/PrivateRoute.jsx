import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';

/**
 * PrivateRoute – protège une route selon l'authentification et le rôle optionnel.
 *
 * Usage :
 *   <PrivateRoute>                        → login requis
 *   <PrivateRoute role="ROLE_ADMIN">      → login + rôle ADMIN
 *   <PrivateRoute role="ROLE_MODERATEUR"> → login + rôle MODÉRATEUR
 */
const PrivateRoute = ({ children, role }) => {
    const location = useLocation();
    const user = AuthService.getCurrentUser();

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