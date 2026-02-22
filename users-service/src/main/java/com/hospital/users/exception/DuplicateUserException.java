package com.hospital.users.exception;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      DUPLICATE USER EXCEPTION                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Custom exception for when a user already exists.                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public class DuplicateUserException extends RuntimeException {
    
    public DuplicateUserException(String message) {
        super(message);
    }
}
