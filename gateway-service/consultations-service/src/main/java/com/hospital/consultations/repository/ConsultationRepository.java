package com.hospital.consultations.repository;

import com.hospital.consultations.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      CONSULTATION REPOSITORY                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  Spring Data JPA repository for Consultation entities.                        ║
 * ║                                                                              ║
 * ║  Spring Data JPA automatically implements this interface.                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, UUID> {
    
    /**
     * Finds all consultations for a specific patient.
     * This functionality is mandatory according to the Kit Commun.
     */
    List<Consultation> findByPatientIdOrderByDateDesc(UUID patientId);
    
    /**
     * Finds all consultations by a specific doctor/user.
     */
    List<Consultation> findByUserIdOrderByDateDesc(UUID userId);
}
