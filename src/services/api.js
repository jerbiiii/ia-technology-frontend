import axios from 'axios';

/**
 * Instance Axios configurée pour l'API IA-Technology
 * Base URL : http://localhost:8080/api
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
});

/* ── Intercepteur requêtes : ajouter JWT si présent ── */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/* ── Intercepteur réponses : gérer les 401 ── */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // ✅ FIX: Ne rediriger QUE si l'utilisateur était censé être connecté
            // et qu'on n'est pas déjà sur /login (évite les boucles de redirection).
            const token = localStorage.getItem('token');
            const isLoginPage = window.location.pathname === '/login';

            if (token && !isLoginPage) {
                // Token expiré côté serveur — nettoyer et rediriger proprement
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                // ✅ FIX: Utiliser un événement personnalisé que AuthContext peut écouter,
                // au lieu de window.location.href qui détruit l'état React.
                window.dispatchEvent(new CustomEvent('auth:logout'));
            }
        }
        return Promise.reject(error);
    }
);

export default api;