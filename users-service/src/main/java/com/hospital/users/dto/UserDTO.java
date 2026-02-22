package com.hospital.users.dto;

import com.hospital.users.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         USER DATA TRANSFER OBJECT                           ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  DTOs separate the API layer from the persistence layer.                     ║
 * ║                                                                              ║
 * ║  This DTO is mandatory according to the Kit Commun                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private UUID userId;

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String firstName;

    private String lastName;

    private Set<UserRole> roles;

    private boolean enabled;
}
