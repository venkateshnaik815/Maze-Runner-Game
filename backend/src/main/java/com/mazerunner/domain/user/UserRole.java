package com.mazerunner.domain.user;

/**
 * Enumeration of platform user roles.
 *
 * <p>Used for Spring Security role-based access control (RBAC).
 * All roles are prefixed with ROLE_ at the Spring Security level.
 */
public enum UserRole {

    /**
     * Standard player — can access game features, profile, leaderboard, achievements.
     */
    PLAYER,

    /**
     * Platform administrator — can access admin dashboard, manage users,
     * view analytics, configure mazes, and manage achievements.
     */
    ADMIN
}
