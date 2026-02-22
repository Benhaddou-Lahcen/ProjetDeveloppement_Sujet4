package com.hospital.users.dto;

import com.hospital.users.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      USER CREATE REQUEST DTO                                 ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Separate DTO for user creation requests.                                    ║
 * ║                                                                              ║
 * ║  This DTO is mandatory according to the Kit Commun                           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    private String firstName;

    private String lastName;

    private Set<UserRole> roles;
}
