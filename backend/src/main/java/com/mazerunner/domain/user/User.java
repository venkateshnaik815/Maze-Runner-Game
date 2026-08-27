package com.mazerunner.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Core user domain entity.
 *
 * <p>Represents an authenticated platform user. Passwords are always stored
 * as BCrypt hashes (strength 12). The entity enforces email uniqueness and
 * username uniqueness at both DB and domain level.
 *
 * <p>This is the aggregate root of the User bounded context.
 *
 * @author Venkatesh Naik
 */
@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(name = "uq_users_email",    columnNames = "email"),
        @UniqueConstraint(name = "uq_users_username", columnNames = "username")
    }
)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = {"passwordHash", "emailVerifyToken"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "username", nullable = false, length = 50)
    private String username;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role = UserRole.PLAYER;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "email_verify_token", length = 255)
    private String emailVerifyToken;

    @Column(name = "email_verify_token_expiry")
    private Instant emailVerifyTokenExpiry;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    /**
     * Factory method — creates a new unverified PLAYER user.
     *
     * @param username     desired username (3–50 chars)
     * @param email        email address (unique)
     * @param passwordHash BCrypt-hashed password
     * @return new User instance (not yet persisted)
     */
    public static User createPlayer(
            final String username,
            final String email,
            final String passwordHash) {
        final User user = new User();
        user.username = username.trim().toLowerCase();
        user.email = email.trim().toLowerCase();
        user.passwordHash = passwordHash;
        user.role = UserRole.PLAYER;
        user.active = true;
        user.emailVerified = false;
        return user;
    }

    /**
     * Records a successful login timestamp.
     */
    public void recordLogin() {
        this.lastLoginAt = Instant.now();
    }

    /**
     * Verifies the user's email address, clearing the token.
     */
    public void verifyEmail() {
        this.emailVerified = true;
        this.emailVerifyToken = null;
        this.emailVerifyTokenExpiry = null;
    }

    /**
     * Sets a new email verification token.
     *
     * @param token     hashed token value
     * @param expiresAt token expiry instant
     */
    public void setEmailVerification(final String token, final Instant expiresAt) {
        this.emailVerifyToken = token;
        this.emailVerifyTokenExpiry = expiresAt;
    }

    /**
     * Deactivates the user account (soft delete).
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * Reactivates a previously deactivated account.
     */
    public void activate() {
        this.active = true;
    }

    /**
     * Returns true if this user holds the ADMIN role.
     *
     * @return true if ADMIN
     */
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }
}
