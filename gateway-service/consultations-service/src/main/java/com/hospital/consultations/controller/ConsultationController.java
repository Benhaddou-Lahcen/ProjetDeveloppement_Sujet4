package com.hospital.consultations.controller;

import com.hospital.consultations.dto.ConsultationCreateRequest;
import com.hospital.consultations.dto.ConsultationDTO;
import com.hospital.consultations.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CONSULTATION REST CONTROLLER                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Exposes REST API endpoints for consultation operations.                    ║
 * ║                                                                              ║
 * ║  This controller is mandatory according to the Kit Commun                     ║
 * ║  Base URL: /api/consultations                                                ║
 * ║                                                                              ║
 * ║  Functionalities:                                                            ║
 * ║    - Création d'une consultation                                             ║
 * ║    - Consultation de l'historique d'un patient                                ║
 * ║    - Mise à jour d'une consultation                                          ║
 * ║                                                                              ║
 * ║  // Permissions will be checked in Subject 2                                 ║
 * ║  // Security will be reinforced in Subject 3                                 ║
 * ║                                                                              ║
 * ║  IMPORTANT: Never log diagnostic data in clear text!                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
@Slf4j
public class ConsultationController {

    private final ConsultationService consultationService;

    /**
     * Creates a new consultation.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @PostMapping
    public ResponseEntity<ConsultationDTO> createConsultation(
            @Valid @RequestBody ConsultationCreateRequest request) {
        log.info("REST request to create consultation");
        // IMPORTANT: Never log diagnostic in clear text!
        // Permissions will be checked in Subject 2
        ConsultationDTO createdConsultation = consultationService.createConsultation(request);
        return new ResponseEntity<>(createdConsultation, HttpStatus.CREATED);
    }

    @GetMapping
    public List<ConsultationDTO> getAllConsultations(){
        return consultationService.getAll();
    }

    /**
     * Retrieves a consultation by ID.
     */
    @GetMapping("/{consultationId}")
    public ResponseEntity<ConsultationDTO> getConsultationById(
            @PathVariable UUID consultationId) {
        log.info("REST request to get consultation by ID: {}", consultationId);
        // Permissions will be checked in Subject 2
        return consultationService.getConsultationById(consultationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Retrieves consultation history for a patient.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<ConsultationDTO>> getPatientHistory(
            @PathVariable UUID patientId) {
        log.info("REST request to get consultation history for patient: {}", patientId);
        // Permissions will be checked in Subject 2
        List<ConsultationDTO> consultations = consultationService.getPatientHistory(patientId);
        return ResponseEntity.ok(consultations);
    }

    /**
     * Updates an existing consultation.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @PutMapping("/{consultationId}")
    public ResponseEntity<ConsultationDTO> updateConsultation(
            @PathVariable UUID consultationId,
            @Valid @RequestBody ConsultationDTO consultationDTO) {
        log.info("REST request to update consultation: {}", consultationId);
        // IMPORTANT: Never log diagnostic in clear text!
        // Permissions will be checked in Subject 2
        ConsultationDTO updatedConsultation = consultationService.updateConsultation(
                consultationId, consultationDTO);
        return ResponseEntity.ok(updatedConsultation);
    }
}
