import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * PrivateRoute — composant de protection de route
 *
 * Props :
 *   roles : string[] — liste des rôles autorisés, ex: ['ADMIN'] ou ['ADMIN','MODERATEUR']
 *            Si non fourni → toute personne authentifiée peut accéder
 *
 * user.role est une STRING : "ADMIN" | "MODERATEUR" | "UTILISATEUR"
 * (c'est ce que renvoie le backend dans JwtResponse)
 *
 * Exemples d'utilisation dans App.jsx :
 *   <Route path="/admin/*"      element={<PrivateRoute roles={['ADMIN']} />}>
 *   <Route path="/moderateur/*" element={<PrivateRoute roles={['ADMIN','MODERATEUR']} />}>
 *   <Route path="/profile"      element={<PrivateRoute />}>
 */
const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Pas connecté → login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Rôle insuffisant → accueil
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. Accès autorisé
    return children;
};

export default PrivateRoute;