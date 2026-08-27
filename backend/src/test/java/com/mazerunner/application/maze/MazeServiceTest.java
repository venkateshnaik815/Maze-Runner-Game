package com.mazerunner.application.maze;

import com.mazerunner.domain.maze.Maze;
import com.mazerunner.domain.maze.MazeAlgorithm;
import com.mazerunner.domain.user.MazeDifficulty;
import com.mazerunner.domain.maze.generator.MazeGenerationStrategy;
import com.mazerunner.domain.maze.generator.MazeGeneratorFactory;
import com.mazerunner.domain.maze.generator.RecursiveBacktrackerGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class MazeServiceTest {

    @Mock
    private MazeGeneratorFactory factory;

    private MazeService mazeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mazeService = new MazeService(factory);
    }

    @Test
    void testGenerateMaze_Easy() {
        MazeGenerationStrategy mockStrategy = new RecursiveBacktrackerGenerator();
        when(factory.getStrategy(MazeAlgorithm.RECURSIVE_BACKTRACKER)).thenReturn(mockStrategy);

        Maze maze = mazeService.generateMaze(MazeDifficulty.EASY, MazeAlgorithm.RECURSIVE_BACKTRACKER);

        assertThat(maze).isNotNull();
        assertThat(maze.getWidth()).isEqualTo(10);
        assertThat(maze.getHeight()).isEqualTo(10);
        assertThat(maze.getDifficulty()).isEqualTo(MazeDifficulty.EASY);
        assertThat(maze.getAlgorithm()).isEqualTo(MazeAlgorithm.RECURSIVE_BACKTRACKER);
        assertThat(maze.getGrid()[0][0].getWalls().isLeft()).isFalse(); // Start is open
    }
}
