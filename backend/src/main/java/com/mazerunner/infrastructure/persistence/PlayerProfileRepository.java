package com.mazerunner.infrastructure.persistence;

import com.mazerunner.domain.user.PlayerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link PlayerProfile} entities.
 *
 * @author Venkatesh Naik
 */
@Repository
public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, UUID> {

    /**
     * Finds the profile for a given user ID.
     *
     * @param userId the user's UUID
     * @return Optional PlayerProfile
     */
    Optional<PlayerProfile> findByUserId(UUID userId);

    /**
     * Finds a public profile by user ID.
     *
     * @param userId the user's UUID
     * @return Optional PlayerProfile (only if publicProfile = true)
     */
    @Query("SELECT p FROM PlayerProfile p WHERE p.user.id = :userId AND p.publicProfile = true")
    Optional<PlayerProfile> findPublicByUserId(@Param("userId") UUID userId);

    /**
     * Checks if a profile exists for the given user.
     *
     * @param userId the user's UUID
     * @return true if profile exists
     */
    boolean existsByUserId(UUID userId);
}
