package com.mazerunner.domain.maze;

/**
 * Supported algorithms for procedural maze generation.
 * Each algorithm produces mazes with different aesthetic and difficulty characteristics.
 */
public enum MazeAlgorithm {
    /**
     * Produces mazes with long, winding paths and high "river" factor.
     * Few dead ends, making it visually appealing but potentially easy to backtrack.
     */
    RECURSIVE_BACKTRACKER,

    /**
     * Produces mazes with many short dead ends. 
     * Very low "river" factor. Often looks like a sprawling fractal.
     */
    PRIMS,

    /**
     * Produces mazes with lots of short, random paths.
     * High uniform distribution of dead ends.
     */
    KRUSKALS,

    /**
     * Loop-erased random walk. Unbiased uniform spanning tree.
     * Produces very organic looking mazes without distinct pattern bias.
     */
    WILSONS,

    /**
     * Random walk algorithm. 
     * Similar unbiased characteristics to Wilson's but highly inefficient for large grids.
     */
    ALDOUS_BRODER
}
