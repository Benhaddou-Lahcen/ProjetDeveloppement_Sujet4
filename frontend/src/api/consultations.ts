import { apiClient } from "./client";

export interface Consultation {
  id: number;
  patientId: number;
  staffId: number;
  consultationDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateConsultationRequest {
  patientId: number;
  staffId: number;
  consultationDate: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
}

export const consultationsApi = {
  getAll: (page = 0, size = 10) =>
    apiClient.get(`/consultations`),

  getById: (id: number) =>
    apiClient.get(`/consultations/${id}`),

  create: (data: CreateConsultationRequest) =>
    apiClient.post("/consultations", data),

  update: (id: number, data: Partial<Consultation>) =>
    apiClient.put(`/consultations/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/consultations/${id}`),

  getByPatient: (patientId: number) =>
    apiClient.get(`/consultations/patient/${patientId}`),

  getByStaff: (staffId: number) =>
    apiClient.get(`/consultations/staff/${staffId}`)
};
