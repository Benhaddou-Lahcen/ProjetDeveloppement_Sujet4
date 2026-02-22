package com.hospital.users.repository;

import com.hospital.users.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         USER REPOSITORY                                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  Spring Data JPA repository for User entities.                               ║
 * ║                                                                              ║
 * ║  Spring Data JPA automatically implements this interface.                   ║
 * ║  No need to write implementation code.                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    
    /**
     * Finds a user by username.
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Finds a user by email.
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Checks if a username exists.
     */
    boolean existsByUsername(String username);
    
    /**
     * Checks if an email exists.
     */
    boolean existsByEmail(String email);
}
