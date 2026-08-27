package com.mazerunner.domain.maze.generator;

import com.mazerunner.domain.maze.Cell;
import com.mazerunner.domain.maze.MazeAlgorithm;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PrimsMazeGeneratorTest {

    private final PrimsMazeGenerator generator = new PrimsMazeGenerator();

    @Test
    void testAlgorithmType() {
        assertThat(generator.getAlgorithm()).isEqualTo(MazeAlgorithm.PRIMS);
    }

    @Test
    void testGenerateValidMazeDimensions() {
        Cell[][] grid = generator.generate(10, 15);
        assertThat(grid).hasDimensions(15, 10); // 15 rows, 10 cols
    }
}
