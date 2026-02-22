package com.hospital.consultations.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                   CONSULTATION CREATE REQUEST DTO                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Separate DTO for consultation creation requests.                            ║
 * ║                                                                              ║
 * ║  This DTO is mandatory according to the Kit Commun                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationCreateRequest {

    @NotNull(message = "Patient ID is required")
    private UUID patientId;

    @NotNull(message = "User ID (doctor) is required")
    private UUID userId;

    @NotNull(message = "Date is required")
    private LocalDateTime date;

    @NotBlank(message = "Type is required")
    private String type;

    /**
     * Diagnostic - sensitive medical data.
     * IMPORTANT: Never log this in clear text!
     */
    private String diagnostic;
}
