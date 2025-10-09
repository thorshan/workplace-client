import apiClient from "./apiClient";

export const leaveApi = {
  getLeaves: () => apiClient.get("/leaves"),
  getLeave: (id) => apiClient.get(`/leaves/${id}`),
  updateLeaveStatus: (id, data) => apiClient.put(`/leaves/${id}/status`, data),
  deleteLeave: (id) => apiClient.delete(`/leaves/${id}`),
};
