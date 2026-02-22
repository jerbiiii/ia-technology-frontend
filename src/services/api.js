import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// ── Intercepteur request : JWT + CSRF ─────────────────────────────────────

api.interceptors.request.use(config => {
    // Lire le token depuis localStorage
    // AuthContext stocke le token dans 'token' ET dans 'user.token'
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Lire le cookie CSRF et l'envoyer dans le header pour les requêtes non-GET
    const csrfToken = getCookie('XSRF-TOKEN');
    if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
    }

    return config;
}, error => Promise.reject(error));

// ── Intercepteur response : gestion expiration JWT ────────────────────────

let isRedirecting = false; // garde pour éviter les boucles

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 && !isRedirecting) {
            const isLoginRoute = error.config?.url?.includes('/auth/signin');

            
            if (!isLoginRoute) {
                isRedirecting = true;

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth:logout'));

                setTimeout(() => { isRedirecting = false; }, 3000);
            }
        }
        return Promise.reject(error);
    }
);

// ── Utilitaire lecture cookie ──────────────────────────────────────────────

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default api;