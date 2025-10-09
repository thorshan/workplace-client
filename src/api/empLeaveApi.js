import employeeApiClient from "./employeeApiClient";

export const empLeaveApi = {
  getLeavesByEmployee: (employeeId) =>
    employeeApiClient.get(`/leaves/${employeeId}`),
  createLeave: (data) => employeeApiClient.post("/leaves", data),
  updateLeave: (id, data) => employeeApiClient.put(`/leaves/${id}`, data),
};
