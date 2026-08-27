package com.mazerunner.presentation.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/** Request DTO for password reset completion. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResetPasswordRequest {

    @NotBlank(message = "Reset token is required")
    private String token;

    @NotBlank(message = "New password is required")
    private String newPassword;
}
