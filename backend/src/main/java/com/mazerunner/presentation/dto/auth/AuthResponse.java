package com.mazerunner.presentation.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * Response DTO returned after successful authentication (register/login/refresh).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("refresh_token")
    private String refreshToken;

    @JsonProperty("token_type")
    private String tokenType;

    @JsonProperty("expires_in")
    private long expiresIn;      // seconds

    @JsonProperty("user_id")
    private String userId;

    private String username;
    private String email;
    private String role;

    @JsonProperty("email_verified")
    private boolean emailVerified;
}
