package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.MazeAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Stack;

@Component
public class RecursiveBacktrackerGenerator extends AbstractMazeGenerator {

    @Override
    public Cell[][] generate(int width, int height) {
        Cell[][] grid = initializeGrid(width, height);
        boolean[][] visited = new boolean[height][width];
        Stack<Cell> stack = new Stack<>();

        Cell current = grid[0][0];
        visited[0][0] = true;
        stack.push(current);

        while (!stack.isEmpty()) {
            current = stack.peek();
            List<Cell> unvisited = getUnvisitedNeighbors(current, grid, visited);

            if (!unvisited.isEmpty()) {
                Collections.shuffle(unvisited);
                Cell next = unvisited.get(0);

                removeWallBetween(current, next);
                visited[next.getRow()][next.getCol()] = true;
                stack.push(next);
            } else {
                stack.pop();
            }
        }
        return grid;
    }

    @Override
    public MazeAlgorithm getAlgorithm() {
        return MazeAlgorithm.RECURSIVE_BACKTRACKER;
    }
}
