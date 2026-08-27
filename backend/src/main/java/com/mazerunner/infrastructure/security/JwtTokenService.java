package com.mazerunner.infrastructure.security;

import com.mazerunner.domain.user.User;
import com.mazerunner.domain.user.UserRole;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

/**
 * JWT token service — generates and validates access tokens.
 *
 * <p>Uses HMAC-SHA-256 signing. Access tokens embed:
 * <ul>
 *   <li>{@code sub} — user UUID</li>
 *   <li>{@code username} — display username</li>
 *   <li>{@code role} — UserRole (PLAYER / ADMIN)</li>
 *   <li>{@code jti} — unique token identifier (for future blacklisting)</li>
 * </ul>
 *
 * @author Venkatesh Naik
 */
@Slf4j
@Service
public class JwtTokenService {

    private final SecretKey signingKey;
    private final long accessTokenExpiryMs;

    public JwtTokenService(
            @Value("${app.jwt.secret}") final String secret,
            @Value("${app.jwt.access-token-expiry-ms}") final long accessTokenExpiryMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpiryMs = accessTokenExpiryMs;
    }

    /**
     * Generates a signed JWT access token for the given user.
     *
     * @param user the authenticated user
     * @return signed JWT string
     */
    public String generateAccessToken(final User user) {
        final Instant now = Instant.now();
        final Instant expiry = now.plusMillis(accessTokenExpiryMs);

        return Jwts.builder()
            .subject(user.getId().toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiry))
            .id(UUID.randomUUID().toString())
            .claims(Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name(),
                "email", user.getEmail()
            ))
            .signWith(signingKey)
            .compact();
    }

    /**
     * Extracts all claims from a JWT token string.
     *
     * @param token the raw JWT string
     * @return parsed Claims object
     * @throws JwtException if the token is invalid or expired
     */
    public Claims extractAllClaims(final String token) {
        return Jwts.parser()
            .verifyWith(signingKey)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    /**
     * Extracts the user UUID subject from a token.
     *
     * @param token raw JWT string
     * @return user UUID as String
     */
    public String extractSubject(final String token) {
        return extractAllClaims(token).getSubject();
    }

    /**
     * Extracts the username claim from a token.
     *
     * @param token raw JWT string
     * @return username
     */
    public String extractUsername(final String token) {
        return (String) extractAllClaims(token).get("username");
    }

    /**
     * Extracts the role claim from a token.
     *
     * @param token raw JWT string
     * @return UserRole
     */
    public UserRole extractRole(final String token) {
        final String roleStr = (String) extractAllClaims(token).get("role");
        return UserRole.valueOf(roleStr);
    }

    /**
     * Validates a JWT token — checks signature, expiry, and that username matches.
     *
     * @param token    raw JWT string
     * @param username expected username
     * @return true if token is valid for the given username
     */
    public boolean isTokenValid(final String token, final String username) {
        try {
            final Claims claims = extractAllClaims(token);
            final String tokenUsername = (String) claims.get("username");
            return username.equals(tokenUsername) && !isTokenExpired(claims);
        } catch (ExpiredJwtException e) {
            log.debug("JWT token expired: {}", e.getMessage());
            return false;
        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Returns true if the token has expired.
     *
     * @param claims parsed JWT claims
     * @return true if expired
     */
    private boolean isTokenExpired(final Claims claims) {
        return claims.getExpiration().before(new Date());
    }

    /**
     * Returns the access token expiry duration in milliseconds.
     *
     * @return expiry in ms
     */
    public long getAccessTokenExpiryMs() {
        return accessTokenExpiryMs;
    }
}
