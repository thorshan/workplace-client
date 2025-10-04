import apiClient from "./apiClient";

export const userApi = {
  getUsers: () => apiClient.get("/users"),
  getUser: (id) => apiClient.get(`/users/${id}`),
  createUser: (data) => apiClient.post("/users/register", data),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
};
