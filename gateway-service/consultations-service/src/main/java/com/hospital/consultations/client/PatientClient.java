package com.hospital.consultations.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         PATIENT CLIENT (Feign)                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  Feign client for calling Patient Service to validate patient existence.      ║
 * ║                                                                              ║
 * ║  This client is used to validate patient references in consultations.        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@FeignClient(name = "patient-service", path = "/api/patients")
public interface PatientClient {

    /**
     * Checks if a patient exists.
     * 
     * @param patientId The patient ID
     * @return true if patient exists
     */
    @GetMapping("/{patientId}/exists")
    Boolean checkPatientExists(@PathVariable UUID patientId);
}
