import employeeApiClient from "./employeeApiClient";

export const empLeaveApi = {
  getLeavesByEmployee: (employeeId) =>
    employeeApiClient.post(`/leaves/${employeeId}`),
  createLeave: (data) => employeeApiClient.post("/leaves/create", data),
  updateLeave: (id, data) => employeeApiClient.put(`/leaves/${id}`, data),
};
