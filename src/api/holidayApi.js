import apiClient from "./apiClient";

export const holidayApi = {
  getHolidays: () => apiClient.get("/holidays"),
  getHoliday: (id) => apiClient.get(`/holidays/${id}`),
  createHoliday: (data) => apiClient.post("/holidays", data),
  updateHoliday: (id, data) => apiClient.put(`/holidays/${id}`, data),
  deleteHoliday: (id) => apiClient.delete(`/holidays/${id}`),
};
