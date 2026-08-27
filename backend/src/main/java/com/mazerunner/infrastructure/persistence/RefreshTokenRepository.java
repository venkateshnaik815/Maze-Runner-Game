package com.mazerunner.infrastructure.persistence;

import com.mazerunner.domain.user.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link RefreshToken} entities.
 *
 * @author Venkatesh Naik
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    /**
     * Finds a non-revoked, non-expired refresh token by its hash.
     *
     * @param tokenHash SHA-256 hash of the raw token
     * @return Optional RefreshToken
     */
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.tokenHash = :tokenHash " +
           "AND rt.revokedAt IS NULL AND rt.expiresAt > CURRENT_TIMESTAMP")
    Optional<RefreshToken> findValidByTokenHash(@Param("tokenHash") String tokenHash);

    /**
     * Finds any refresh token by hash (including revoked/expired).
     *
     * @param tokenHash SHA-256 hash
     * @return Optional RefreshToken
     */
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    /**
     * Revokes all active refresh tokens for a given user (on logout).
     *
     * @param userId    the user's UUID
     * @param revokedAt the revocation timestamp
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :revokedAt " +
           "WHERE rt.user.id = :userId AND rt.revokedAt IS NULL")
    void revokeAllForUser(
        @Param("userId") UUID userId,
        @Param("revokedAt") Instant revokedAt
    );

    /**
     * Deletes all expired refresh tokens (for cleanup scheduler).
     *
     * @param cutoff tokens expired before this instant will be deleted
     * @return number of deleted tokens
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :cutoff")
    int deleteExpiredTokensBefore(@Param("cutoff") Instant cutoff);

    /**
     * Counts active (valid) refresh tokens for a given user.
     *
     * @param userId the user's UUID
     * @return count of valid tokens
     */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user.id = :userId " +
           "AND rt.revokedAt IS NULL AND rt.expiresAt > CURRENT_TIMESTAMP")
    long countValidTokensForUser(@Param("userId") UUID userId);
}
