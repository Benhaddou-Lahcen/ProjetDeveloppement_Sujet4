package com.hospital.consultations.service;

import com.hospital.consultations.dto.ConsultationCreateRequest;
import com.hospital.consultations.dto.ConsultationDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     CONSULTATION SERVICE INTERFACE                           ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  Defines the contract for consultation operations.                            ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                      ║
 * ║  Functionalities:                                                            ║
 * ║    - Création d'une consultation                                             ║
 * ║    - Consultation de l'historique d'un patient                              ║
 * ║    - Mise à jour d'une consultation                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public interface ConsultationService {

    /**
     * Creates a new consultation.
     * This functionality is mandatory according to the Kit Commun.
     */
    ConsultationDTO createConsultation(ConsultationCreateRequest request);

    /**
     * Retrieves a consultation by ID.
     */
    Optional<ConsultationDTO> getConsultationById(UUID consultationId);

    /**
     * Retrieves consultation history for a patient.
     * This functionality is mandatory according to the Kit Commun.
     */
    List<ConsultationDTO> getPatientHistory(UUID patientId);

    /**
     * Updates an existing consultation.
     * This functionality is mandatory according to the Kit Commun.
     */
    ConsultationDTO updateConsultation(UUID consultationId, ConsultationDTO consultationDTO);
}
