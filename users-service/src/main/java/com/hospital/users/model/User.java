package com.hospital.users.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                             USER ENTITY                                      ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Represents a system user for the Users & Roles service.                    ║
 * ║                                                                              ║
 * ║  This entity is mandatory according to the Kit Commun                         ║
 * ║                                                                              ║
 * ║  NOTE: This is separate from the User entity in auth-service.                ║
 * ║  This service manages user profiles and role assignments.                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /**
     * Unique identifier for the user (UUID).
     * This field is mandatory according to the Kit Commun.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", updatable = false, nullable = false)
    private UUID userId;

    /**
     * Username for login.
     */
    @Column(unique = true, nullable = false)
    private String username;

    /**
     * Email address.
     */
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * First name.
     */
    @Column(name = "first_name")
    private String firstName;

    /**
     * Last name.
     */
    @Column(name = "last_name")
    private String lastName;

    /**
     * User roles for authorization.
     * This field is mandatory according to the Kit Commun.
     * // Permissions will be checked in Subject 2
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();

    /**
     * Whether the account is active.
     */
    @Column(nullable = false)
    private boolean enabled = true;

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
