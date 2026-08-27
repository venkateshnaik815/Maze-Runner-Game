package com.mazerunner.presentation.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

/** Request DTO for user login. */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}
