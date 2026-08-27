package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.MazeAlgorithm;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class PrimsMazeGenerator extends AbstractMazeGenerator {

    private final Random random = new Random();

    @Override
    public Cell[][] generate(int width, int height) {
        Cell[][] grid = initializeGrid(width, height);
        boolean[][] inMaze = new boolean[height][width];
        List<Cell> frontier = new ArrayList<>();

        // Start at random cell
        int startR = random.nextInt(height);
        int startC = random.nextInt(width);
        inMaze[startR][startC] = true;
        
        addFrontierCells(grid[startR][startC], grid, inMaze, frontier);

        while (!frontier.isEmpty()) {
            // Pick a random frontier cell
            int fIdx = random.nextInt(frontier.size());
            Cell fCell = frontier.remove(fIdx);

            // Find in-maze neighbors of this frontier cell
            List<Cell> inMazeNeighbors = getInMazeNeighbors(fCell, grid, inMaze);
            if (!inMazeNeighbors.isEmpty()) {
                Cell neighbor = inMazeNeighbors.get(random.nextInt(inMazeNeighbors.size()));
                removeWallBetween(fCell, neighbor);
                inMaze[fCell.getRow()][fCell.getCol()] = true;
                addFrontierCells(fCell, grid, inMaze, frontier);
            }
        }

        return grid;
    }

    private void addFrontierCells(Cell cell, Cell[][] grid, boolean[][] inMaze, List<Cell> frontier) {
        int r = cell.getRow();
        int c = cell.getCol();
        int height = grid.length;
        int width = grid[0].length;

        if (r > 0 && !inMaze[r - 1][c] && !frontier.contains(grid[r - 1][c])) frontier.add(grid[r - 1][c]);
        if (r < height - 1 && !inMaze[r + 1][c] && !frontier.contains(grid[r + 1][c])) frontier.add(grid[r + 1][c]);
        if (c > 0 && !inMaze[r][c - 1] && !frontier.contains(grid[r][c - 1])) frontier.add(grid[r][c - 1]);
        if (c < width - 1 && !inMaze[r][c + 1] && !frontier.contains(grid[r][c + 1])) frontier.add(grid[r][c + 1]);
    }

    private List<Cell> getInMazeNeighbors(Cell cell, Cell[][] grid, boolean[][] inMaze) {
        List<Cell> neighbors = new ArrayList<>();
        int r = cell.getRow();
        int c = cell.getCol();
        int height = grid.length;
        int width = grid[0].length;

        if (r > 0 && inMaze[r - 1][c]) neighbors.add(grid[r - 1][c]);
        if (r < height - 1 && inMaze[r + 1][c]) neighbors.add(grid[r + 1][c]);
        if (c > 0 && inMaze[r][c - 1]) neighbors.add(grid[r][c - 1]);
        if (c < width - 1 && inMaze[r][c + 1]) neighbors.add(grid[r][c + 1]);

        return neighbors;
    }

    @Override
    public MazeAlgorithm getAlgorithm() {
        return MazeAlgorithm.PRIMS;
    }
}
