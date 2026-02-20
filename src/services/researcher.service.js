import api from './api.js';

class ResearcherService {
    getAll() {
        return api.get('/researchers').then(res => res.data);
    }

    getById(id) {
        return api.get(`/researchers/${id}`).then(res => res.data);
    }

    getByUserId(userId) {
        return api.get(`/researchers/by-user/${userId}`).then(res => res.data);
    }

    create(data) {
        return api.post('/researchers', data).then(res => res.data);
    }

    update(id, data) {
        return api.put(`/researchers/${id}`, data).then(res => res.data);
    }

    delete(id) {
        return api.delete(`/researchers/${id}`).then(res => res.data);
    }

    search(params) {
        return api.get('/researchers/search', { params }).then(res => res.data);
    }
}

export default new ResearcherService();