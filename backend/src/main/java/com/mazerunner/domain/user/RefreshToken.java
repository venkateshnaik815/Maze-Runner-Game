package com.mazerunner.domain.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

/**
 * Refresh token domain entity.
 *
 * <p>Supports JWT refresh token rotation. Each login generates a new refresh
 * token. Tokens are stored as hashes (SHA-256) to prevent token theft via
 * DB compromise. When a token is used to refresh, it is revoked (revokedAt set)
 * and a new token pair is issued (rotation pattern).
 *
 * @author Venkatesh Naik
 */
@Entity
@Table(
    name = "refresh_tokens",
    indexes = {
        @Index(name = "idx_refresh_tokens_user_id",    columnList = "user_id"),
        @Index(name = "idx_refresh_tokens_token_hash", columnList = "token_hash"),
        @Index(name = "idx_refresh_tokens_expires_at", columnList = "expires_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
@ToString(exclude = "tokenHash")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_refresh_tokens_user_id"))
    private User user;

    @Column(name = "token_hash", nullable = false, unique = true, length = 255)
    private String tokenHash;

    @Column(name = "device_info", length = 500)
    private String deviceInfo;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    /**
     * Factory method — creates a new active refresh token.
     *
     * @param user       the user this token belongs to
     * @param tokenHash  SHA-256 hash of the raw token value
     * @param expiresAt  token expiry instant
     * @param deviceInfo optional device/user-agent info
     * @param ipAddress  optional client IP address
     * @return new RefreshToken (not persisted)
     */
    public static RefreshToken create(
            final User user,
            final String tokenHash,
            final Instant expiresAt,
            final String deviceInfo,
            final String ipAddress) {
        final RefreshToken token = new RefreshToken();
        token.user = user;
        token.tokenHash = tokenHash;
        token.expiresAt = expiresAt;
        token.deviceInfo = deviceInfo;
        token.ipAddress = ipAddress;
        return token;
    }

    /**
     * Marks this token as revoked.
     */
    public void revoke() {
        this.revokedAt = Instant.now();
    }

    /**
     * Returns true if this token is still valid (not revoked and not expired).
     *
     * @return true if valid
     */
    public boolean isValid() {
        return revokedAt == null && Instant.now().isBefore(expiresAt);
    }

    /**
     * Returns true if this token has been revoked.
     *
     * @return true if revoked
     */
    public boolean isRevoked() {
        return revokedAt != null;
    }

    /**
     * Returns true if this token has expired.
     *
     * @return true if expired
     */
    public boolean isExpired() {
        return Instant.now().isAfter(expiresAt);
    }
}
