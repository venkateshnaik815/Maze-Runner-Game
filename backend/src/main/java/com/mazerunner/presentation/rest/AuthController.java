package com.mazerunner.presentation.rest;

import com.mazerunner.application.auth.AuthService;
import com.mazerunner.infrastructure.security.JwtTokenService;
import com.mazerunner.presentation.dto.auth.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * REST controller for authentication endpoints.
 *
 * <p>All endpoints are under {@code /auth/*} which maps to
 * {@code /api/v1/auth/*} via the server context path.
 *
 * @author Venkatesh Naik
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, logout, token refresh, and password management")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenService jwtTokenService;

    /**
     * Register a new player account.
     *
     * @param request registration payload
     * @return 201 Created with AuthResponse (tokens + user info)
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Register a new player",
        description = "Creates a new player account and returns JWT access + refresh tokens",
        responses = {
            @ApiResponse(responseCode = "201", description = "Registration successful"),
            @ApiResponse(responseCode = "400", description = "Validation error or duplicate username/email"),
        }
    )
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody final RegisterRequest request) {
        final AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Authenticate a user and issue tokens.
     *
     * @param request  login payload (username/email + password)
     * @param httpReq  servlet request (for device/IP extraction)
     * @return 200 OK with AuthResponse
     */
    @PostMapping("/login")
    @Operation(
        summary = "Login",
        description = "Authenticates credentials and returns JWT access + refresh token pair",
        responses = {
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        }
    )
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody final LoginRequest request,
            final HttpServletRequest httpReq) {
        final String deviceInfo = httpReq.getHeader("User-Agent");
        final String ipAddress = getClientIp(httpReq);
        final AuthResponse response = authService.login(request, deviceInfo, ipAddress);
        return ResponseEntity.ok(response);
    }

    /**
     * Refresh an access token using a valid refresh token (rotation pattern).
     *
     * @param request contains the refresh token
     * @return 200 OK with new AuthResponse
     */
    @PostMapping("/refresh")
    @Operation(
        summary = "Refresh access token",
        description = "Exchanges a valid refresh token for a new access + refresh token pair (rotation)",
        responses = {
            @ApiResponse(responseCode = "200", description = "Token refreshed"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token"),
        }
    )
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody final RefreshTokenRequest request) {
        final AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Logout — revokes all refresh tokens for the authenticated user.
     *
     * @param userDetails the authenticated user (from JWT filter)
     * @return 204 No Content
     */
    @PostMapping("/logout")
    @Operation(
        summary = "Logout",
        description = "Revokes all refresh tokens for the authenticated user",
        responses = {
            @ApiResponse(responseCode = "204", description = "Logout successful"),
            @ApiResponse(responseCode = "401", description = "Not authenticated"),
        }
    )
    public ResponseEntity<Void> logout(@AuthenticationPrincipal final UserDetails userDetails) {
        // For now, extract userId from username via userDetails
        // Full implementation uses SecurityContextHolder to get UUID
        authService.logout(UUID.fromString("00000000-0000-0000-0000-000000000000")); // placeholder
        return ResponseEntity.noContent().build();
    }

    /**
     * Verify email address using the token from the verification email.
     *
     * @param token the raw verification token
     * @return 200 OK with confirmation message
     */
    @GetMapping("/verify-email/{token}")
    @Operation(summary = "Verify email", description = "Confirms a player's email address")
    public ResponseEntity<Map<String, String>> verifyEmail(@PathVariable final String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }

    /**
     * Initiate a password reset (sends reset email).
     *
     * @param body JSON with "email" field
     * @return 200 OK (always, to prevent email enumeration)
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Sends password reset email if account exists")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody final Map<String, String> body) {
        authService.forgotPassword(body.getOrDefault("email", ""));
        return ResponseEntity.ok(Map.of("message", "If an account exists with that email, a reset link has been sent"));
    }

    /**
     * Complete a password reset with a token and new password.
     *
     * @param request contains the reset token and new password
     * @return 200 OK with confirmation
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Completes the password reset flow")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody final ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    // ── Helpers ────────────────────────────────────────────────────

    private String getClientIp(final HttpServletRequest request) {
        final String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
