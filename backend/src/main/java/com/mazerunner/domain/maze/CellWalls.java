package com.mazerunner.domain.maze;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CellWalls {
    private boolean top = true;
    private boolean right = true;
    private boolean bottom = true;
    private boolean left = true;
}
