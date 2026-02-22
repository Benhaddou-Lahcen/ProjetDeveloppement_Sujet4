package com.hospital.patient.service;

import com.hospital.patient.dto.PageResponse;
import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                       PATIENT SERVICE INTERFACE                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                  ║
 * ║  Defines the contract for patient-related business operations.               ║
 * ║                                                                              ║
 * ║  WHY use an interface?                                                       ║
 * ║    1. Abstraction: Controller doesn't depend on implementation               ║
 * ║    2. Testability: Easy to mock in unit tests                                ║
 * ║    3. Flexibility: Can swap implementations (e.g., for caching)              ║
 * ║                                                                              ║
 * ║  // Business logic will be added in the specialized subject                  ║
 * ║  Students: Implement the business rules in PatientServiceImpl.               ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public interface PatientService {

    /**
     * Creates a new patient in the system.
     * This endpoint is mandatory according to the Kit Commun.
     * 
     * @param request The patient creation data
     * @return The created patient as DTO
     */
    PatientDTO createPatient(PatientCreateRequest request);

    /**
     * Retrieves a patient by their ID.
     * This endpoint is mandatory according to the Kit Commun.
     * 
     * @param id The patient ID
     * @return Optional containing the patient if found
     */
    Optional<PatientDTO> getPatientById(UUID patientId);

    /**
     * Retrieves a patient by their national ID.
     * 
     * @param nationalId The national ID
     * @return Optional containing the patient if found
     */
    Optional<PatientDTO> getPatientByNationalId(String nationalId);

    /**
     * Retrieves all patients with pagination.
     * // Permissions will be checked in Subject 2
     * 
     * @param pageable Pagination information
     * @return Page of patients
     */
    PageResponse<PatientDTO> getAllPatients(Pageable pageable);

    /**
     * Advanced search across multiple fields with pagination.
     * 
     * @param searchTerm The search term
     * @param pageable Pagination information
     * @return Page of matching patients
     */
    PageResponse<PatientDTO> searchPatients(String searchTerm, Pageable pageable);

    /**
     * Updates an existing patient.
     * This endpoint is mandatory according to the Kit Commun.
     * 
     * @param patientId The patient ID
     * @param patientDTO The updated patient data
     * @return The updated patient as DTO
     */
    PatientDTO updatePatient(UUID patientId, PatientDTO patientDTO);

    /**
     * Deletes a patient by their ID.
     * // Permissions will be checked in Subject 2
     * // Security will be reinforced in Subject 3
     * 
     * @param patientId The patient ID
     */
    void deletePatient(UUID patientId);

    /**
     * Checks if a patient exists.
     * 
     * @param patientId The patient ID
     * @return true if the patient exists
     */
    boolean existsById(UUID patientId);
}

