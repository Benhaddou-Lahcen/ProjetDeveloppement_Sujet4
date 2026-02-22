package com.hospital.users.dto;

import com.hospital.users.model.UserRole;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                      ROLE ASSIGNMENT REQUEST DTO                             ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  DTO for assigning roles to users.                                            ║
 * ║                                                                              ║
 * ║  This functionality is mandatory according to the Kit Commun                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleAssignmentRequest {

    @NotEmpty(message = "At least one role must be assigned")
    private Set<UserRole> roles;
}
