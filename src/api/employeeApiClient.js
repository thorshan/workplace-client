import axios from "axios";

const employeeApiClient = axios.create({
  baseURL: "https://workplace-w264.onrender.com/workplace",
  headers: { "Content-Type": "application/json" },
});

employeeApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("empToken"); // employee token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default employeeApiClient;
