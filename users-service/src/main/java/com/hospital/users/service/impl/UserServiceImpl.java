package com.hospital.users.service.impl;

import com.hospital.users.dto.PageResponse;
import com.hospital.users.dto.RoleAssignmentRequest;
import com.hospital.users.dto.UserCreateRequest;
import com.hospital.users.dto.UserDTO;
import com.hospital.users.exception.DuplicateUserException;
import com.hospital.users.exception.UserNotFoundException;
import com.hospital.users.mapper.UserMapper;
import com.hospital.users.model.User;
import com.hospital.users.repository.UserRepository;
import com.hospital.users.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    USER SERVICE IMPLEMENTATION                                ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Implements the business logic for user operations.                          ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                      ║
 * ║  @Transactional: Ensures database operations are atomic                      ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserDTO createUser(UserCreateRequest request) {
        log.info("Creating new user with username: {}", request.getUsername());

        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateUserException(
                    "User with username " + request.getUsername() + " already exists");
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateUserException(
                    "User with email " + request.getEmail() + " already exists");
        }

        // Map DTO to entity
        User user = userMapper.toEntity(request);
        user.setEnabled(true);

        // Save and return
        User savedUser = userRepository.save(user);
        log.info("User created with ID: {}", savedUser.getUserId());

        return userMapper.toDTO(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserById(UUID userId) {
        log.debug("Fetching user by ID: {}", userId);
        return userRepository.findById(userId)
                .map(userMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<UserDTO> getAllUsers(Pageable pageable) {
        log.debug("Fetching all users with pagination - page: {}, size: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
        
        Page<User> userPage = userRepository.findAll(pageable);
        
        List<UserDTO> content = userPage.getContent().stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
        
        return PageResponse.<UserDTO>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .first(userPage.isFirst())
                .last(userPage.isLast())
                .build();
    }

    @Override
    public UserDTO assignRoles(UUID userId, RoleAssignmentRequest request) {
        log.info("Assigning roles to user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        // Update roles
        user.setRoles(request.getRoles());

        User updatedUser = userRepository.save(user);
        log.info("Roles assigned successfully to user: {}", userId);

        return userMapper.toDTO(updatedUser);
    }
}
