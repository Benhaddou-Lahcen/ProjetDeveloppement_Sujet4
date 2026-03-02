package com.hospital.consultations.exception;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                  CONSULTATION NOT FOUND EXCEPTION                            ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Custom exception for when a consultation is not found.                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public class ConsultationNotFoundException extends RuntimeException {
    
    public ConsultationNotFoundException(String message) {
        super(message);
    }
}
