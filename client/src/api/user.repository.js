import apiClient from "./api.client.js";

const repository = {

    getUsers: (sortBy, sortAsc) => apiClient.get('/user/list', { params: { sortBy, sortAsc } }),

    blockUsers: (ids, block) => apiClient.post('/user/block-by-ids', { ids, block }),

    deleteUsers: (ids) => apiClient.post('/user/delete-by-ids', { ids }),
}

export default repository;