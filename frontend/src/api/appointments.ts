import { apiClient } from "./client";

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  durationMinutes?: number;
  status: string;
  appointmentType?: string;
  reason?: string;
  notes?: string;
  roomNumber?: string;
  patientName?: string;
  doctorName?: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  durationMinutes?: number;
  appointmentType?: string;
  reason?: string;
  notes?: string;
  roomNumber?: string;
}

export const appointmentsApi = {
  getAll: (page = 0, size = 10) =>
    apiClient.get(`/appointments?page=${page}&size=${size}`),

  getById: (id: number) =>
    apiClient.get(`/appointments/${id}`),

  create: (data: CreateAppointmentRequest) =>
    apiClient.post("/appointments", data),

  update: (id: number, data: Partial<Appointment>) =>
    apiClient.put(`/appointments/${id}`, data),

  delete: (id: number) =>
    apiClient.delete(`/appointments/${id}`),

  getByPatient: (patientId: number) =>
    apiClient.get(`/appointments/patient/${patientId}`),

  getByDoctor: (doctorId: number) =>
    apiClient.get(`/appointments/doctor/${doctorId}`),

  getDoctorAppointmentsByDate: (doctorId: number, date: string) =>
    apiClient.get(`/appointments/doctor/${doctorId}/date/${date}`),

  updateStatus: (id: number, status: string) =>
    apiClient.patch(`/appointments/${id}/status`, undefined, { 
      params: { status } 
    })
};
