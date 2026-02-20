import axios from './api';

const API_URL = '/auth/';

class AuthService {
    login(email, password) {
        return axios
            .post(API_URL + 'signin', { email, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
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