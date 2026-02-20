import api from './api.js';

class ActualiteService {
    // Public
    getActive() {
        return api.get('/public/actualites').then(res => res.data);
    }

    // Modérateur/Admin
    getAll() {
        return api.get('/moderator/actualites').then(res => res.data);
    }

    getById(id) {
        return api.get(`/moderator/actualites/${id}`).then(res => res.data);
    }

    create(data) {
        return api.post('/moderator/actualites', data).then(res => res.data);
    }

    update(id, data) {
        return api.put(`/moderator/actualites/${id}`, data).then(res => res.data);
    }

    delete(id) {
        return api.delete(`/moderator/actualites/${id}`).then(res => res.data);
    }
}

export default new ActualiteService();