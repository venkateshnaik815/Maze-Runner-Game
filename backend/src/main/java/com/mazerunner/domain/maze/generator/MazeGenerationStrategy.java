package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.MazeAlgorithm;

/**
 * Strategy interface for Maze Generation algorithms.
 */
public interface MazeGenerationStrategy {
    /**
     * Generates a fully formed maze grid.
     *
     * @param width  The width of the grid
     * @param height The height of the grid
     * @return A 2D array of Cells with walls carved out
     */
    Cell[][] generate(int width, int height);

    /**
     * Returns the algorithm type this strategy implements.
     *
     * @return The MazeAlgorithm
     */
    MazeAlgorithm getAlgorithm();
}
