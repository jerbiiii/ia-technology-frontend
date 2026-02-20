import axios from './api';

const API_URL = '/auth/';

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + 'signin', { email, password })
            .then(response => {
                if (response.data.token) {
                    // ✅ Stocker l'objet user ET le token séparément
                    localStorage.setItem('user', JSON.stringify(response.data));
                    localStorage.setItem('token', response.data.token);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // ✅ Nettoyer le token aussi
    }

    register(nom, prenom, email, password) {
        return axios.post(API_URL + 'signup', {
            nom,
            prenom,
            email,
            password
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();