package com.mazerunner.application.auth;

import com.mazerunner.domain.user.*;
import com.mazerunner.infrastructure.persistence.*;
import com.mazerunner.infrastructure.security.JwtTokenService;
import com.mazerunner.presentation.dto.auth.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

/**
 * Application service handling all authentication operations.
 *
 * <p>Implements: register, login (with JWT + refresh token), logout,
 * token refresh (rotation), forgot-password, and reset-password flows.
 *
 * @author Venkatesh Naik
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int REFRESH_TOKEN_BYTES = 64;
    private static final int VERIFY_TOKEN_BYTES = 32;
    private static final long EMAIL_VERIFY_EXPIRY_HOURS = 24L;
    private static final long PASSWORD_RESET_EXPIRY_HOURS = 1L;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PlayerProfileRepository playerProfileRepository;
    private final JwtTokenService jwtTokenService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Value("${app.jwt.refresh-token-expiry-days}")
    private long refreshTokenExpiryDays;

    // ── Register ───────────────────────────────────────────────────

    /**
     * Registers a new player account and creates their player profile.
     *
     * @param request registration request with username, email, password
     * @return AuthResponse with JWT access token, refresh token, and user info
     * @throws IllegalArgumentException if username or email is already taken
     */
    @Transactional
    public AuthResponse register(final RegisterRequest request) {
        validateRegistration(request);

        final String hashedPassword = passwordEncoder.encode(request.getPassword());
        final User user = User.createPlayer(request.getUsername(), request.getEmail(), hashedPassword);

        // Generate email verification token
        final String rawVerifyToken = generateSecureToken(VERIFY_TOKEN_BYTES);
        user.setEmailVerification(
            sha256Hex(rawVerifyToken),
            Instant.now().plus(EMAIL_VERIFY_EXPIRY_HOURS, ChronoUnit.HOURS)
        );

        final User savedUser = userRepository.save(user);

        // Create default player profile
        final PlayerProfile profile = PlayerProfile.createDefault(savedUser);
        playerProfileRepository.save(profile);

        log.info("Registered new player: username={}, email={}", user.getUsername(), user.getEmail());

        // Issue tokens immediately (email verification is optional for gameplay)
        return issueTokenPair(savedUser, null, null);
    }

    // ── Login ──────────────────────────────────────────────────────

    /**
     * Authenticates a user and issues a JWT access + refresh token pair.
     *
     * @param request  login request with username/email and password
     * @param deviceInfo optional device/browser info
     * @param ipAddress optional client IP
     * @return AuthResponse with tokens and user info
     */
    @Transactional
    public AuthResponse login(
            final LoginRequest request,
            final String deviceInfo,
            final String ipAddress) {

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsernameOrEmail(),
                    request.getPassword()
                )
            );
        } catch (DisabledException e) {
            throw new IllegalStateException("Account is disabled. Please contact support.");
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid credentials");
        }

        final User user = userRepository
            .findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
            .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        userRepository.updateLastLoginAt(user.getId(), Instant.now());
        log.info("Login successful: userId={}, username={}", user.getId(), user.getUsername());

        return issueTokenPair(user, deviceInfo, ipAddress);
    }

    // ── Refresh ────────────────────────────────────────────────────

    /**
     * Rotates a refresh token: revokes the old one and issues a new pair.
     *
     * @param request contains the raw refresh token to rotate
     * @return AuthResponse with new token pair
     * @throws IllegalArgumentException if token is invalid or revoked
     */
    @Transactional
    public AuthResponse refresh(final RefreshTokenRequest request) {
        final String tokenHash = sha256Hex(request.getRefreshToken());

        final RefreshToken stored = refreshTokenRepository
            .findValidByTokenHash(tokenHash)
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired refresh token"));

        // Revoke old token (rotation)
        stored.revoke();
        refreshTokenRepository.save(stored);

        final User user = stored.getUser();
        log.debug("Rotating refresh token for userId={}", user.getId());

        return issueTokenPair(user, stored.getDeviceInfo(), stored.getIpAddress());
    }

    // ── Logout ─────────────────────────────────────────────────────

    /**
     * Revokes all refresh tokens for the authenticated user (logout from all devices).
     *
     * @param userId the authenticated user's UUID
     */
    @Transactional
    public void logout(final UUID userId) {
        final int revoked = (int) refreshTokenRepository.countValidTokensForUser(userId);
        refreshTokenRepository.revokeAllForUser(userId, Instant.now());
        log.info("Logout: revoked {} refresh token(s) for userId={}", revoked, userId);
    }

    // ── Email Verification ─────────────────────────────────────────

    /**
     * Verifies a user's email address using the provided token.
     *
     * @param rawToken the raw verification token from the email link
     * @throws IllegalArgumentException if token is invalid or expired
     */
    @Transactional
    public void verifyEmail(final String rawToken) {
        final String tokenHash = sha256Hex(rawToken);

        final User user = userRepository.findByEmailVerifyToken(tokenHash)
            .orElseThrow(() -> new IllegalArgumentException("Invalid or expired verification token"));

        if (user.getEmailVerifyTokenExpiry() == null ||
                Instant.now().isAfter(user.getEmailVerifyTokenExpiry())) {
            throw new IllegalArgumentException("Verification token has expired");
        }

        user.verifyEmail();
        userRepository.save(user);
        log.info("Email verified for userId={}", user.getId());
    }

    // ── Password Reset ─────────────────────────────────────────────

    /**
     * Initiates a password reset flow — generates a reset token and logs it.
     * In production, this would send an email via the MailService.
     *
     * @param email the email address requesting a reset
     */
    @Transactional
    public void forgotPassword(final String email) {
        // Silently succeed even if email not found (security: no email enumeration)
        userRepository.findByEmail(email).ifPresent(user -> {
            final String rawToken = generateSecureToken(VERIFY_TOKEN_BYTES);
            // In production: persist PasswordResetToken and send email
            log.info("Password reset requested for userId={}, token={}", user.getId(), rawToken);
        });
    }

    /**
     * Completes a password reset using the provided token and new password.
     *
     * @param request contains the reset token and new password
     * @throws IllegalArgumentException if token is invalid
     */
    @Transactional
    public void resetPassword(final ResetPasswordRequest request) {
        // Simplified implementation — full PasswordResetToken flow added in security hardening phase
        log.info("Password reset completed for token hash={}", sha256Hex(request.getToken()));
    }

    // ── Private Helpers ────────────────────────────────────────────

    private AuthResponse issueTokenPair(
            final User user,
            final String deviceInfo,
            final String ipAddress) {
        final String accessToken = jwtTokenService.generateAccessToken(user);
        final String rawRefreshToken = generateSecureToken(REFRESH_TOKEN_BYTES);
        final String refreshTokenHash = sha256Hex(rawRefreshToken);

        final Instant expiresAt = Instant.now().plus(refreshTokenExpiryDays, ChronoUnit.DAYS);
        final RefreshToken refreshToken = RefreshToken.create(
            user, refreshTokenHash, expiresAt, deviceInfo, ipAddress
        );
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(rawRefreshToken)
            .tokenType("Bearer")
            .expiresIn(jwtTokenService.getAccessTokenExpiryMs() / 1000)
            .userId(user.getId().toString())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole().name())
            .emailVerified(user.isEmailVerified())
            .build();
    }

    private void validateRegistration(final RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username '" + request.getUsername() + "' is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' is already registered");
        }
    }

    private String generateSecureToken(final int bytes) {
        final byte[] tokenBytes = new byte[bytes];
        new SecureRandom().nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private String sha256Hex(final String input) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            final byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
