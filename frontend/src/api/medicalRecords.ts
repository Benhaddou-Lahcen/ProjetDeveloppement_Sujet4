import { apiClient } from "./client";

export interface MedicalEntry {
  id: number;
  type: string;
  description: string;
  date: string;
  createdAt?: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  entries: MedicalEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMedicalEntryRequest {
  type: string;
  description: string;
  date: string;
}

export const medicalRecordsApi = {
  getByPatient: (patientId: number) =>
    apiClient.get(`/api/medical-records/patient/${patientId}`),

  getAll: (page = 0, size = 10) =>
    apiClient.get(`/api/medical-records?page=${page}&size=${size}`),

  getById: (id: number) =>
    apiClient.get(`/api/medical-records/${id}`),

  createMedicalRecord: (patientId: number) =>
    apiClient.post(`/api/medical-records/patient/${patientId}`),

  addEntry: (patientId: number, data: CreateMedicalEntryRequest) =>
    apiClient.post(`/api/medical-records/patient/${patientId}/entries`, data),

  update: (id: number, data: Partial<MedicalRecord>) =>
    apiClient.put(`/api/medical-records/${id}`, data),

  getOrCreate: (patientId: number) =>
    apiClient.get(`/api/medical-records/patient/${patientId}/ensure`)
};
