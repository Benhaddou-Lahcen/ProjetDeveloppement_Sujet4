import { apiClient } from "./client";

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface RoleAssignmentRequest {
  roles: string[];
}

export const usersApi = {
  getAll: (page = 0, size = 10) =>
    apiClient.get(`/api/users?page=${page}&size=${size}`),

  getById: (id: number) =>
    apiClient.get(`/api/users/${id}`),

  create: (data: CreateUserRequest) =>
    apiClient.post("/api/users", data),

  update: (id: number, data: Partial<User>) =>
    apiClient.put(`/api/users/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/api/users/${id}`),

  assignRoles: (id: number, data: RoleAssignmentRequest) =>
    apiClient.post(`/api/users/${id}/roles`, data),

  activate: (id: number) =>
    apiClient.patch(`/api/users/${id}/activate`, {}),

  deactivate: (id: number) =>
    apiClient.patch(`/api/users/${id}/deactivate`, {})
};
