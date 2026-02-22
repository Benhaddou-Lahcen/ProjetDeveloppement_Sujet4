package com.hospital.auth.service.impl;

import com.hospital.auth.dto.AuthResponse;
import com.hospital.auth.dto.LoginRequest;
import com.hospital.auth.dto.RegisterRequest;
import com.hospital.auth.model.Role;
import com.hospital.auth.model.User;
import com.hospital.auth.repository.UserRepository;
import com.hospital.auth.service.AuthService;
import com.hospital.auth.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     AUTH SERVICE IMPLEMENTATION                              ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Implements authentication logic.                                            ║
 * ║                                                                              ║
 * ║  // Security will be reinforced in Subject 3                                 ║
 * ║                                                                              ║
 * ║  IMPORTANT: This is a PLACEHOLDER implementation.                            ║
 * ║  Students MUST implement proper JWT handling in Subject 3.                   ║
 * ║  Current implementation is for structure demonstration only.                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user: {}", request.getUsername());

        // Check for existing user
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .staffId(request.getStaffId())
                .roles(Set.of(Role.ROLE_PATIENT)) // Default role
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered with ID: {}", savedUser.getId());

        // Generate JWT tokens
        Set<String> roles = savedUser.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        
        String accessToken = jwtService.generateAccessToken(savedUser.getUsername(), roles);
        String refreshToken = jwtService.generateRefreshToken(savedUser.getUsername(), roles);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600L)
                .username(savedUser.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Invalid password for user: {}", request.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("Account is disabled");
        }

        // Generate JWT tokens
        Set<String> roles = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());
        
        String accessToken = jwtService.generateAccessToken(user.getUsername(), roles);
        String refreshToken = jwtService.generateRefreshToken(user.getUsername(), roles);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(3600L)
                .username(user.getUsername())
                .roles(roles)
                .build();
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        log.debug("Refreshing token");
        
        // Validate refresh token
        if (!jwtService.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        // Extract username and roles from refresh token
        String username = jwtService.getUsernameFromToken(refreshToken);
        Set<String> roles = jwtService.getRolesFromToken(refreshToken);

        // Generate new access token
        String newAccessToken = jwtService.generateAccessToken(username, roles);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // Keep the same refresh token
                .tokenType("Bearer")
                .expiresIn(3600L)
                .username(username)
                .roles(roles)
                .build();
    }

    @Override
    public boolean validateToken(String token) {
        log.debug("Validating token");
        return jwtService.validateToken(token);
    }
}

