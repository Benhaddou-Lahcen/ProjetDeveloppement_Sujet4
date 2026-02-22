package com.hospital.patient.controller;

import com.hospital.patient.dto.PageResponse;
import com.hospital.patient.dto.PatientCreateRequest;
import com.hospital.patient.dto.PatientDTO;
import com.hospital.patient.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         PATIENT REST CONTROLLER                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Exposes REST API endpoints for patient operations.                          ║
 * ║  This is the entry point for all HTTP requests to the Patient Service.       ║
 * ║                                                                              ║
 * ║  This endpoint is mandatory according to the Kit Commun                      ║
 * ║                                                                              ║
 * ║  Base URL: /api/patients                                                     ║
 * ║                                                                              ║
 * ║  Students: Controllers should be THIN - delegate to services.                ║
 * ║  // Permissions will be checked in Subject 2                                 ║
 * ║  // Security will be reinforced in Subject 3                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Slf4j
public class PatientController {

    private final PatientService patientService;

    // ═══════════════════════════════════════════════════════════════════════════
    // CREATE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Creates a new patient.
     * 
     * This endpoint is mandatory according to the Kit Commun
     * 
     * @param request The patient creation request
     * @return The created patient with HTTP 201
     */
    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@Valid @RequestBody PatientCreateRequest request) {
        log.info("REST request to create patient");
        // Permissions will be checked in Subject 2
        PatientDTO createdPatient = patientService.createPatient(request);
        return new ResponseEntity<>(createdPatient, HttpStatus.CREATED);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // READ OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Retrieves all patients with pagination.
     * 
     * This endpoint is mandatory according to the Kit Commun
     * // Permissions will be checked in Subject 2
     * 
     * @param page Page number (default: 0)
     * @param size Page size (default: 20)
     * @param sortBy Sort field (default: createdAt)
     * @param sortDir Sort direction (default: DESC)
     * @return Page of patients
     */
    @GetMapping
    public ResponseEntity<PageResponse<PatientDTO>> getAllPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        log.info("REST request to get all patients - page: {}, size: {}", page, size);
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<PatientDTO> patients = patientService.getAllPatients(pageable);
        return ResponseEntity.ok(patients);
    }

    /**
     * Retrieves a patient by ID.
     * 
     * This endpoint is mandatory according to the Kit Commun
     * 
     * @param id The patient ID
     * @return The patient if found, 404 otherwise
     */
    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDTO> getPatientById(@PathVariable UUID patientId) {
        log.info("REST request to get patient by ID: {}", patientId);
        // Permissions will be checked in Subject 2
        return patientService.getPatientById(patientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves a patient by national ID.
     * 
     * @param nationalId The national ID
     * @return The patient if found, 404 otherwise
     */
    @GetMapping("/national-id/{nationalId}")
    public ResponseEntity<PatientDTO> getPatientByNationalId(@PathVariable String nationalId) {
        log.info("REST request to get patient by national ID: {}", nationalId);
        // Security will be reinforced in Subject 3
        return patientService.getPatientByNationalId(nationalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Advanced search across multiple fields (firstName, lastName, nationalId, email).
     * 
     * @param query The search query
     * @param page Page number (default: 0)
     * @param size Page size (default: 20)
     * @return Page of matching patients
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<PatientDTO>> searchPatients(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("REST request to search patients with query: {} - page: {}, size: {}", query, page, size);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastName").ascending());
        PageResponse<PatientDTO> patients = patientService.searchPatients(query, pageable);
        return ResponseEntity.ok(patients);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UPDATE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Updates an existing patient.
     * 
     * This endpoint is mandatory according to the Kit Commun
     * // Permissions will be checked in Subject 2
     * 
     * @param id The patient ID
     * @param patientDTO The updated patient data
     * @return The updated patient
     */
    @PutMapping("/{patientId}")
    public ResponseEntity<PatientDTO> updatePatient(
            @PathVariable UUID patientId,
            @Valid @RequestBody PatientDTO patientDTO) {
        log.info("REST request to update patient: {}", patientId);
        PatientDTO updatedPatient = patientService.updatePatient(patientId, patientDTO);
        return ResponseEntity.ok(updatedPatient);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // DELETE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Deletes a patient by ID.
     * 
     * // Permissions will be checked in Subject 2
     * // Security will be reinforced in Subject 3
     * 
     * @param id The patient ID
     * @return HTTP 204 No Content on success
     */
    @DeleteMapping("/{patientId}")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID patientId) {
        log.info("REST request to delete patient: {} (soft delete)", patientId);
        patientService.deletePatient(patientId);
        return ResponseEntity.noContent().build();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITY OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Checks if a patient exists.
     * WHY: Useful for other services to validate patient references.
     * 
     * @param patientId The patient ID
     * @return HTTP 200 if exists, 404 if not
     */
    @GetMapping("/{patientId}/exists")
    public ResponseEntity<Boolean> checkPatientExists(@PathVariable UUID patientId) {
        log.debug("REST request to check if patient exists: {}", patientId);
        boolean exists = patientService.existsById(patientId);
        return ResponseEntity.ok(exists);
    }
}

