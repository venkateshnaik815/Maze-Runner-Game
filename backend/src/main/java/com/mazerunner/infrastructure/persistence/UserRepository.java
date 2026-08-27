package com.mazerunner.infrastructure.persistence;

import com.mazerunner.domain.user.User;
import com.mazerunner.domain.user.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

/**
 * JPA repository for {@link User} entities.
 *
 * <p>All finder methods operate only on active, non-deleted users unless
 * explicitly querying for admin/management purposes.
 *
 * @author Venkatesh Naik
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Finds an active user by username or email (case-insensitive).
     *
     * @param username username to look up
     * @param email    email to look up
     * @return Optional containing the user if found
     */
    @Query("SELECT u FROM User u WHERE (LOWER(u.username) = LOWER(:username) " +
           "OR LOWER(u.email) = LOWER(:email)) AND u.active = true")
    Optional<User> findByUsernameOrEmail(
        @Param("username") String username,
        @Param("email") String email
    );

    /**
     * Finds a user by username (exact, case-insensitive).
     *
     * @param username the username
     * @return Optional user
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    Optional<User> findByUsername(@Param("username") String username);

    /**
     * Finds a user by email address (case-insensitive).
     *
     * @param email the email address
     * @return Optional user
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmail(@Param("email") String email);

    /**
     * Finds a user by email verification token.
     *
     * @param token the verification token (not hashed)
     * @return Optional user
     */
    Optional<User> findByEmailVerifyToken(String token);

    /**
     * Checks if a username already exists (case-insensitive).
     *
     * @param username the username to check
     * @return true if exists
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsername(@Param("username") String username);

    /**
     * Checks if an email already exists (case-insensitive).
     *
     * @param email the email to check
     * @return true if exists
     */
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    boolean existsByEmail(@Param("email") String email);

    /**
     * Admin: lists all users with filtering and pagination.
     *
     * @param search   optional search string (username or email)
     * @param role     optional role filter
     * @param pageable pagination config
     * @return page of users
     */
    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:role IS NULL OR u.role = :role) " +
           "ORDER BY u.createdAt DESC")
    Page<User> findAllWithFilters(
        @Param("search") String search,
        @Param("role") UserRole role,
        Pageable pageable
    );

    /**
     * Updates lastLoginAt for a user by ID.
     *
     * @param userId    the user UUID
     * @param loginTime the login timestamp
     */
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = :loginTime WHERE u.id = :userId")
    void updateLastLoginAt(
        @Param("userId") UUID userId,
        @Param("loginTime") Instant loginTime
    );
}
