package com.mazerunner.domain.maze;

import com.mazerunner.domain.user.MazeDifficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Maze {
    private String id;
    private String name;
    private int width;
    private int height;
    private MazeDifficulty difficulty;
    private MazeAlgorithm algorithm;
    private Cell[][] grid;
    private Position start;
    private Position end;
    private Instant createdAt;
}
