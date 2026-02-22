package com.hospital.users.model;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                          USER ROLE ENUMERATION                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS ENUM EXISTS:                                                       ║
 * ║  Defines the roles available in the system according to the Kit Commun.      ║
 * ║                                                                              ║
 * ║  This enum is mandatory according to the Kit Commun                          ║
 * ║  Roles: ADMIN, MÉDECIN, INFIRMIER, PATIENT                                    ║
 * ║                                                                              ║
 * ║  // Permissions will be checked in Subject 2                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public enum UserRole {
    /**
     * System administrator - full access.
     * This role is mandatory according to the Kit Commun.
     */
    ADMIN,
    
    /**
     * Medical doctor - can diagnose and treat patients.
     * This role is mandatory according to the Kit Commun.
     */
    MÉDECIN,
    
    /**
     * Nurse - provides patient care.
     * This role is mandatory according to the Kit Commun.
     */
    INFIRMIER,
    
    /**
     * Patient - can view own records.
     * This role is mandatory according to the Kit Commun.
     */
    PATIENT
}
