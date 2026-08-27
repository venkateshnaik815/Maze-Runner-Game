package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.Position;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractMazeGenerator implements MazeGenerationStrategy {

    protected Cell[][] initializeGrid(int width, int height) {
        Cell[][] grid = new Cell[height][width];
        for (int r = 0; r < height; r++) {
            for (int c = 0; c < width; c++) {
                grid[r][c] = new Cell(r, c);
            }
        }
        return grid;
    }

    protected void removeWallBetween(Cell a, Cell b) {
        if (a.getRow() == b.getRow()) {
            if (a.getCol() > b.getCol()) {
                a.getWalls().setLeft(false);
                b.getWalls().setRight(false);
            } else {
                a.getWalls().setRight(false);
                b.getWalls().setLeft(false);
            }
        } else {
            if (a.getRow() > b.getRow()) {
                a.getWalls().setTop(false);
                b.getWalls().setBottom(false);
            } else {
                a.getWalls().setBottom(false);
                b.getWalls().setTop(false);
            }
        }
    }

    protected List<Cell> getUnvisitedNeighbors(Cell cell, Cell[][] grid, boolean[][] visited) {
        List<Cell> neighbors = new ArrayList<>();
        int r = cell.getRow();
        int c = cell.getCol();
        int height = grid.length;
        int width = grid[0].length;

        if (r > 0 && !visited[r - 1][c]) neighbors.add(grid[r - 1][c]);
        if (r < height - 1 && !visited[r + 1][c]) neighbors.add(grid[r + 1][c]);
        if (c > 0 && !visited[r][c - 1]) neighbors.add(grid[r][c - 1]);
        if (c < width - 1 && !visited[r][c + 1]) neighbors.add(grid[r][c + 1]);

        return neighbors;
    }
}
