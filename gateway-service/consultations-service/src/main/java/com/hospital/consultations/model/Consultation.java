package com.hospital.consultations.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                          CONSULTATION ENTITY                                  ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Represents a medical consultation in the hospital system.                     ║
 * ║                                                                              ║
 * ║  This entity is mandatory according to the Kit Commun                         ║
 * ║  Fields:                                                                      ║
 * ║    - consultation_id (UUID)                                                   ║
 * ║    - patient_id (UUID)                                                        ║
 * ║    - user_id (médecin) (UUID)                                                 ║
 * ║    - date                                                                     ║
 * ║    - type de consultation                                                     ║
 * ║    - diagnostic (champ texte simple)                                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Entity
@Table(name = "consultations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {

    /**
     * Unique identifier for the consultation (UUID).
     * This field is mandatory according to the Kit Commun.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "consultation_id", updatable = false, nullable = false)
    private UUID consultationId;

    /**
     * Reference to the patient (UUID).
     * This field is mandatory according to the Kit Commun.
     */
    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    /**
     * Reference to the doctor/user (UUID).
     * This field is mandatory according to the Kit Commun.
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * Consultation date and time.
     * This field is mandatory according to the Kit Commun.
     */
    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    /**
     * Type of consultation.
     * This field is mandatory according to the Kit Commun.
     */
    @Column(name = "type", nullable = false)
    private String type;

    /**
     * Diagnostic (simple text field).
     * This field is mandatory according to the Kit Commun.
     * IMPORTANT: This is sensitive medical data - never log in clear text!
     */
    @Column(name = "diagnostic", length = 2000)
    private String diagnostic;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
