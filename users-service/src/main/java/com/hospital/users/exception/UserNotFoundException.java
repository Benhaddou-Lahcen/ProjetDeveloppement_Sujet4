package com.hospital.users.exception;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      USER NOT FOUND EXCEPTION                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Custom exception for when a user is not found.                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public class UserNotFoundException extends RuntimeException {
    
    public UserNotFoundException(String message) {
        super(message);
    }
}
