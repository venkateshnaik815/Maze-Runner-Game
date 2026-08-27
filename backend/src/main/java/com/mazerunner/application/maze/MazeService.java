package com.mazerunner.application.maze;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.Maze;
import com.mazerunner.domain.maze.MazeAlgorithm;
import com.mazerunner.domain.user.MazeDifficulty;
import com.mazerunner.domain.maze.Position;
import com.mazerunner.domain.maze.generator.MazeGenerationStrategy;
import com.mazerunner.domain.maze.generator.MazeGeneratorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MazeService {

    private final MazeGeneratorFactory generatorFactory;

    public Maze generateMaze(MazeDifficulty difficulty, MazeAlgorithm algorithm) {
        int size = determineSize(difficulty);
        
        MazeGenerationStrategy strategy = generatorFactory.getStrategy(algorithm);
        Cell[][] grid = strategy.generate(size, size);

        // Open start and end points
        grid[0][0].getWalls().setLeft(false);
        grid[0][0].setStart(true);
        grid[size - 1][size - 1].getWalls().setRight(false);
        grid[size - 1][size - 1].setEnd(true);

        return Maze.builder()
                .id(UUID.randomUUID().toString())
                .name(difficulty.name() + " " + algorithm.name() + " Maze")
                .width(size)
                .height(size)
                .difficulty(difficulty)
                .algorithm(algorithm)
                .grid(grid)
                .start(new Position(0, 0))
                .end(new Position(size - 1, size - 1))
                .createdAt(Instant.now())
                .build();
    }

    private int determineSize(MazeDifficulty difficulty) {
        return switch (difficulty) {
            case EASY -> 10;
            case MEDIUM -> 15;
            case HARD -> 20;
            case EXPERT -> 25;
            case LEGENDARY -> 50;
        };
    }
}
