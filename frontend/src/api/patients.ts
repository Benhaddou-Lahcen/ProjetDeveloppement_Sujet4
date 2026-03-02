import { apiClient } from "./client";

export interface Patient {
  patientId: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

export interface PatientCreateRequest {
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export const fetchPatients = async (
  page = 0,
  size = 20
): Promise<PageResponse<Patient>> => {
  const response = await apiClient.get<PageResponse<Patient>>(
    `/patients`,
    {
      params: { page, size }
    }
  );
  return response.data;
};

export const getPatientById = async (patientId: string): Promise<Patient> => {
  const response = await apiClient.get<Patient>(`/patients/${patientId}`);
  return response.data;
};

export const createPatient = async (
  payload: PatientCreateRequest
): Promise<Patient> => {
  const response = await apiClient.post<Patient>(
    `/patients`,
    payload
  );

  return response.data;
};

// export const createPatient = async (
//   payload: Omit<Patient, "patientId">
// ): Promise<Patient> => {
//   const response = await apiClient.post<Patient>("/patients", payload);
//   return response.data;
// };

export const updatePatient = async (
  patientId: string,
  payload: Partial<Patient>
): Promise<Patient> => {
  const response = await apiClient.put<Patient>(`/patients/${patientId}`, payload);
  return response.data;
};

export const deletePatient = async (patientId: string): Promise<void> => {
  await apiClient.delete(`/patients/${patientId}`);
};

