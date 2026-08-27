package com.mazerunner.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Password reset token domain entity.
 *
 * <p>Single-use token issued for password reset flows.
 * Token values are stored as SHA-256 hashes.
 * Once used, usedAt is set and the token cannot be reused.
 *
 * @author Venkatesh Naik
 */
@Entity
@Table(
    name = "password_reset_tokens",
    indexes = {
        @Index(name = "idx_password_reset_user_id",    columnList = "user_id"),
        @Index(name = "idx_password_reset_token_hash", columnList = "token_hash")
    }
)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = "tokenHash")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_password_reset_user_id"))
    private User user;

    @Column(name = "token_hash", nullable = false, unique = true, length = 255)
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /**
     * Creates a new password reset token.
     *
     * @param user      the user requesting a reset
     * @param tokenHash SHA-256 hash of the raw token
     * @param expiresAt expiry instant (typically 1 hour from now)
     * @return new PasswordResetToken (not persisted)
     */
    public static PasswordResetToken create(
            final User user,
            final String tokenHash,
            final Instant expiresAt) {
        final PasswordResetToken token = new PasswordResetToken();
        token.user = user;
        token.tokenHash = tokenHash;
        token.expiresAt = expiresAt;
        return token;
    }

    /**
     * Marks this token as used. Once marked, isUsable() returns false.
     */
    public void markUsed() {
        this.usedAt = Instant.now();
    }

    /**
     * Returns true if the token can still be used (not used and not expired).
     *
     * @return true if usable
     */
    public boolean isUsable() {
        return usedAt == null && Instant.now().isBefore(expiresAt);
    }
}
