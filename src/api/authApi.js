import apiClient from "./apiClient";

export const authApi = {
  login: (data) => apiClient.post("/login", data),
  logout: () => apiClient.post("/logout"),
};
