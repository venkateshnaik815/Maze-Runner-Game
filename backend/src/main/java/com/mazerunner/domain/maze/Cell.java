package com.mazerunner.domain.maze;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cell {
    private int row;
    private int col;
    private CellWalls walls = new CellWalls();
    private boolean isStart = false;
    private boolean isEnd = false;

    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
    }
}
