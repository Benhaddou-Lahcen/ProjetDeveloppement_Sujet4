package com.hospital.consultations.exception;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      INVALID CONSULTATION EXCEPTION                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Custom exception for invalid consultation data.                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public class InvalidConsultationException extends RuntimeException {
    
    public InvalidConsultationException(String message) {
        super(message);
    }
}
