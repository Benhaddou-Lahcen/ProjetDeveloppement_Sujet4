package com.hospital.users.service;

import com.hospital.users.dto.PageResponse;
import com.hospital.users.dto.RoleAssignmentRequest;
import com.hospital.users.dto.UserCreateRequest;
import com.hospital.users.dto.UserDTO;
import org.springframework.data.domain.Pageable;

import java.util.Optional;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                        USER SERVICE INTERFACE                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  Defines the contract for user operations.                                   ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                      ║
 * ║  Functionalities:                                                            ║
 * ║    - Création d'utilisateurs                                                 ║
 * ║    - Attribution de rôles                                                    ║
 * ║    - Consultation des utilisateurs                                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
public interface UserService {

    /**
     * Creates a new user.
     * This functionality is mandatory according to the Kit Commun.
     */
    UserDTO createUser(UserCreateRequest request);

    /**
     * Retrieves a user by ID.
     * This functionality is mandatory according to the Kit Commun.
     */
    Optional<UserDTO> getUserById(UUID userId);

    /**
     * Retrieves all users with pagination.
     * This functionality is mandatory according to the Kit Commun.
     */
    PageResponse<UserDTO> getAllUsers(Pageable pageable);

    /**
     * Assigns roles to a user.
     * This functionality is mandatory according to the Kit Commun.
     */
    UserDTO assignRoles(UUID userId, RoleAssignmentRequest request);
}
