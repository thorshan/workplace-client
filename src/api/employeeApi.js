import apiClient from "./apiClient";

export const employeeApi = {
  getEmployees: () => apiClient.get("/employee"),
  getEmployee: (id) => apiClient.get(`/employee/${id}`),
  createEmployee: (data) => apiClient.post("/employee", data),
  updateEmployee: (id, data) => apiClient.put(`/employee/${id}`, data),
  deleteEmployee: (id) => apiClient.delete(`/employee/${id}`),
};
