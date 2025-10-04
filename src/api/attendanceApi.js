import apiClient from "./apiClient";

export const attendanceApi = {
  getAttendances: () => apiClient.get("/attendance"),
  getAttendance: (id) => apiClient.get(`/attendance/${id}`),
  createAttendance: (data) => apiClient.post("/attendance", data),
  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
  deleteAttendance: (id) => apiClient.delete(`/attendance/${id}`),
};
