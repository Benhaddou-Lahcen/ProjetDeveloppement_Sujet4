package com.hospital.users.mapper;

import com.hospital.users.dto.UserCreateRequest;
import com.hospital.users.dto.UserDTO;
import com.hospital.users.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                            USER MAPPER                                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS INTERFACE EXISTS:                                                 ║
 * ║  MapStruct automatically generates code to map between entities and DTOs.     ║
 * ║                                                                              ║
 * ║  WHY MapStruct:                                                              ║
 * ║    - Compile-time code generation (fast, no runtime overhead)              ║
 * ║    - Type-safe mapping                                                       ║
 * ║    - Reduces boilerplate code                                                ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    UserDTO toDTO(User user);

    User toEntity(UserCreateRequest request);

    void updateEntityFromDTO(UserDTO dto, @MappingTarget User entity);
}
