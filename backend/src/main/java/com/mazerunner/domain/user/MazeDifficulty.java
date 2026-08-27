package com.mazerunner.domain.user;

/**
 * Enumeration of maze difficulty levels.
 *
 * <p>Each level defines the grid size, time limit, scoring multiplier,
 * and hint/power-up availability.
 *
 * <p>Used across game session, maze, leaderboard, and achievement domains.
 */
public enum MazeDifficulty {

    /** 10×10 grid, 5 min timer, 5 hints, 1.0× multiplier */
    EASY,

    /** 15×15 grid, 4 min timer, 3 hints, 1.5× multiplier */
    MEDIUM,

    /** 20×20 grid, 3 min timer, 1 hint, 2.0× multiplier */
    HARD,

    /** 30×30 grid, 2 min timer, 0 hints, 3.0× multiplier */
    EXPERT,

    /** 40×40 grid, 90 sec timer, 0 hints, 5.0× multiplier */
    LEGENDARY
}
