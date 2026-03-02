package com.hospital.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;
import java.util.function.Function;

/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                            JWT SERVICE                                        ║
 * ╠══════════════════════════════════════════════════════════════════════════════╣
 * ║  WHY THIS CLASS EXISTS:                                                      ║
 * ║  Handles JWT token generation and validation.                                ║
 * ║                                                                              ║
 * ║  This service is mandatory according to the Kit Commun                      ║
 * ║  Functionalities:                                                            ║
 * ║    - Génération de JWT                                                       ║
 * ║    - Vérification de token                                                   ║
 * ║    - Gestion de session (expiration)                                         ║
 * ║    - Gestion des rôles dans le token                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */
@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    /**
     * Generates an access token for a user.
     * This functionality is mandatory according to the Kit Commun.
     */
    public String generateAccessToken(String username, Set<String> roles) {
        return generateToken(username, roles, expiration);
    }

    /**
     * Generates a refresh token for a user.
     */
    public String generateRefreshToken(String username, Set<String> roles) {
        return generateToken(username, roles, refreshExpiration);
    }

    /**
     * Generates a JWT token.
     */
    private String generateToken(String username, Set<String> roles, Long expirationTime) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(username)
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates a JWT token.
     * This functionality is mandatory according to the Kit Commun.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts username from token.
     */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * Extracts roles from token.
     * This functionality is mandatory according to the Kit Commun.
     */
    @SuppressWarnings("unchecked")
    public Set<String> getRolesFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return (Set<String>) claims.get("roles");
    }

    /**
     * Checks if token is expired.
     */
    public Boolean isTokenExpired(String token) {
        Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * Extracts expiration date from token.
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from token.
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts all claims from token.
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Gets the signing key for JWT.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
