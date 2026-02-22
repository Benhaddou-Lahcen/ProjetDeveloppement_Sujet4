package com.hospital.users.controller;

import com.hospital.users.dto.PageResponse;
import com.hospital.users.dto.RoleAssignmentRequest;
import com.hospital.users.dto.UserCreateRequest;
import com.hospital.users.dto.UserDTO;
import com.hospital.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         USER REST CONTROLLER                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Exposes REST API endpoints for user operations.                             ║
 * ║                                                                              ║
 * ║  This controller is mandatory according to the Kit Commun                    ║
 * ║  Base URL: /api/users                                                       ║
 * ║                                                                              ║
 * ║  Functionalities:                                                            ║
 * ║    - Création d'utilisateurs                                                 ║
 * ║    - Attribution de rôles                                                    ║
 * ║    - Consultation des utilisateurs                                           ║
 * ║                                                                              ║
 * ║  // Permissions will be checked in Subject 2                                 ║
 * ║  // Security will be reinforced in Subject 3                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Creates a new user.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateRequest request) {
        log.info("REST request to create user");
        // Permissions will be checked in Subject 2
        UserDTO createdUser = userService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    /**
     * Retrieves all users with pagination.
     * This endpoint is mandatory according to the Kit Commun.
     * 
     * @param page Page number (default: 0)
     * @param size Page size (default: 20)
     * @param sortBy Sort field (default: createdAt)
     * @param sortDir Sort direction (default: DESC)
     * @return Page of users
     */
    @GetMapping
    public ResponseEntity<PageResponse<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {
        log.info("REST request to get all users - page: {}, size: {}", page, size);
        // Permissions will be checked in Subject 2
        
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        PageResponse<UserDTO> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Retrieves a user by ID.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable UUID userId) {
        log.info("REST request to get user by ID: {}", userId);
        // Permissions will be checked in Subject 2
        return userService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Assigns roles to a user.
     * This endpoint is mandatory according to the Kit Commun.
     */
    @PutMapping("/{userId}/roles")
    public ResponseEntity<UserDTO> assignRoles(
            @PathVariable UUID userId,
            @Valid @RequestBody RoleAssignmentRequest request) {
        log.info("REST request to assign roles to user: {}", userId);
        // Permissions will be checked in Subject 2
        UserDTO updatedUser = userService.assignRoles(userId, request);
        return ResponseEntity.ok(updatedUser);
    }
}
