import { apiClient } from "./client";

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  role: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialty: string;
  role: string;
  department?: string;
}

export const staffApi = {
  getAll: (page = 0, size = 10) =>
     apiClient.get(`/staff`),
//     apiClient.get(`/staff?page=${page}&size=${size}`),

  getById: (id: number) =>
    apiClient.get(`/staff/${id}`),

  create: (data: CreateStaffRequest) =>
    apiClient.post("/staff", data),

  update: (id: number, data: Partial<Staff>) =>
    apiClient.put(`/staff/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/staff/${id}`),

  getBySpecialty: (specialty: string) =>
    apiClient.get(`/staff?specialty=${specialty}`),

  getByRole: (role: string) =>
    apiClient.get(`/staff?role=${role}`)
};
