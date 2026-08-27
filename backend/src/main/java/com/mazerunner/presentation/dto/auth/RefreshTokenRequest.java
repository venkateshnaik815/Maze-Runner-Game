package com.mazerunner.presentation.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/** Request DTO for refresh token rotation. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
