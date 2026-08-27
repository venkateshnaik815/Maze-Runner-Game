import type { Cell, Maze, Position, MazeDifficulty } from '@/types';
import { DIFFICULTY_CONFIG } from '@/constants';

export function generateMaze(difficulty: MazeDifficulty): Maze {
  const config = DIFFICULTY_CONFIG[difficulty];
  const width = config.gridSize;
  const height = config.gridSize;

  // Initialize grid
  const grid: Cell[][] = Array.from({ length: height }, (_, row) =>
    Array.from({ length: width }, (_, col) => ({
      row,
      col,
      walls: { top: true, right: true, bottom: true, left: true },
      isStart: row === 0 && col === 0,
      isEnd: row === height - 1 && col === width - 1,
    }))
  );

  // Recursive Backtracker algorithm
  const stack: Cell[] = [];
  const visited = new Set<string>();

  const startCell = grid[0][0]!;
  visited.add(`0,0`);
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]!;
    const unvisitedNeighbors = getUnvisitedNeighbors(current, grid, visited, width, height);

    if (unvisitedNeighbors.length > 0) {
      // Pick a random unvisited neighbor
      const { cell: next, direction } = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)]!;
      
      // Remove walls between current and next
      if (direction === 'top') {
        current.walls.top = false;
        next.walls.bottom = false;
      } else if (direction === 'right') {
        current.walls.right = false;
        next.walls.left = false;
      } else if (direction === 'bottom') {
        current.walls.bottom = false;
        next.walls.top = false;
      } else if (direction === 'left') {
        current.walls.left = false;
        next.walls.right = false;
      }

      visited.add(`${next.row},${next.col}`);
      stack.push(next);
    } else {
      stack.pop();
    }
  }

  // Open the entrance and exit completely to the outside
  grid[0][0]!.walls.left = false;
  grid[height - 1][width - 1]!.walls.right = false;

  return {
    id: `maze-${Date.now()}`,
    name: `${config.label} Challenge`,
    width,
    height,
    difficulty,
    algorithm: 'RECURSIVE_BACKTRACKER',
    grid,
    start: { row: 0, col: 0 },
    end: { row: height - 1, col: width - 1 },
    createdAt: new Date().toISOString(),
  };
}

function getUnvisitedNeighbors(cell: Cell, grid: Cell[][], visited: Set<string>, width: number, height: number) {
  const neighbors: { cell: Cell; direction: 'top' | 'right' | 'bottom' | 'left' }[] = [];
  
  // Top
  if (cell.row > 0 && !visited.has(`${cell.row - 1},${cell.col}`)) {
    neighbors.push({ cell: grid[cell.row - 1][cell.col]!, direction: 'top' });
  }
  // Right
  if (cell.col < width - 1 && !visited.has(`${cell.row},${cell.col + 1}`)) {
    neighbors.push({ cell: grid[cell.row][cell.col + 1]!, direction: 'right' });
  }
  // Bottom
  if (cell.row < height - 1 && !visited.has(`${cell.row + 1},${cell.col}`)) {
    neighbors.push({ cell: grid[cell.row + 1][cell.col]!, direction: 'bottom' });
  }
  // Left
  if (cell.col > 0 && !visited.has(`${cell.row},${cell.col - 1}`)) {
    neighbors.push({ cell: grid[cell.row][cell.col - 1]!, direction: 'left' });
  }

  return neighbors;
}
