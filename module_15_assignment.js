// 1. Solve a 2D maze using recursive backtracking.

// Find all paths using recursive backtracking
function find_all_paths(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const allPaths = [];

  let start = null, end = null;

  // Find start and end
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (maze[i][j] === 'S') start = [i, j];
      if (maze[i][j] === 'E') end = [i, j];
    }
  }

  if (!start || !end) return [];

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const directions = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];

  function backtrack(x, y, path) {
    if (
      x < 0 || y < 0 ||
      x >= rows || y >= cols ||
      maze[x][y] === '1' ||
      visited[x][y]
    ) return;

    if (maze[x][y] === 'E') {
      allPaths.push([...path, [x, y]]);
      return;
    }

    visited[x][y] = true;
    path.push([x, y]);

    for (const [dx, dy] of directions) {
      backtrack(x + dx, y + dy, path);
    }

    path.pop();
    visited[x][y] = false;
  }

  backtrack(start[0], start[1], []);
  return allPaths;
}

// Return shortest path or null if unsolvable
function solve_maze(maze) {
  const allPaths = find_all_paths(maze);
  if (allPaths.length === 0) return null;

  // Find the shortest path
  let shortest = allPaths.reduce((a, b) => (a.length <= b.length ? a : b));
  return shortest;
}

// Example Maze
const maze = [
  ['S', '0', '1', '0', '0'],
  ['0', '1', '0', '1', '0'],
  ['0', '0', '0', '1', '0'],
  ['1', '1', '0', '0', 'E']
];

console.log("All Paths:");
console.log(find_all_paths(maze));

console.log("Shortest Path:");
console.log(solve_maze(maze));


// 2. Generate fractal patterns using recursion.
function createCanvas(width, height) {
  const canvas = [];
  for (let i = 0; i < height; i++) {
    canvas.push(new Array(width).fill(' '));
  }
  return canvas;
}

function printCanvas(canvas) {
  canvas.forEach(row => console.log(row.join('')));
}

// Simple recursive tree for terminal
function draw_tree(canvas, x, y, length, depth) {
  if (depth === 0) return;

  for (let i = 0; i < length; i++) {
    if (y - i >= 0) canvas[y - i][x] = '*'; // draw vertical trunk
  }

  if (depth > 1) {
    // Left branch
    draw_branch(canvas, x, y - length, length, -1, depth - 1);
    // Right branch
    draw_branch(canvas, x, y - length, length, 1, depth - 1);
  }
}

function draw_branch(canvas, x, y, length, direction, depth) {
  for (let i = 0; i < length; i++) {
    const nx = x + i * direction;
    const ny = y - i;
    if (ny >= 0 && nx >= 0 && nx < canvas[0].length) canvas[ny][nx] = '*';
  }
  // Recursive branching
  if (depth > 1) {
    const nx = x + length * direction;
    const ny = y - length;
    draw_branch(canvas, nx, ny, Math.floor(length * 0.7), direction, depth - 1);
    draw_branch(canvas, nx, ny, Math.floor(length * 0.7), -direction, depth - 1);
  }
}


function drawLine(canvas, x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1),
    dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    if (canvas[y1] && canvas[y1][x1] !== undefined) canvas[y1][x1] = '*';
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
}


// ====================== SIERPINSKI TRIANGLE ======================
function draw_sierpinski_triangle(canvas, x1, y1, x2, y2, x3, y3, depth) {
  if (depth === 0) {
    drawLine(canvas, x1, y1, x2, y2);
    drawLine(canvas, x2, y2, x3, y3);
    drawLine(canvas, x3, y3, x1, y1);
    return;
  }
  const mx12 = Math.floor((x1 + x2) / 2);
  const my12 = Math.floor((y1 + y2) / 2);
  const mx23 = Math.floor((x2 + x3) / 2);
  const my23 = Math.floor((y2 + y3) / 2);
  const mx31 = Math.floor((x3 + x1) / 2);
  const my31 = Math.floor((y3 + y1) / 2);

  draw_sierpinski_triangle(canvas, x1, y1, mx12, my12, mx31, my31, depth - 1);
  draw_sierpinski_triangle(canvas, x2, y2, mx23, my23, mx12, my12, depth - 1);
  draw_sierpinski_triangle(canvas, x3, y3, mx31, my31, mx23, my23, depth - 1);
}


// Koch recursive line
function drawKoch(canvas, x1, y1, x2, y2, depth) {
  if (depth === 0) {
    drawLine(canvas, Math.round(x1), Math.round(y1), Math.round(x2), Math.round(y2));
    return;
  }

  const dx = (x2 - x1) / 3;
  const dy = (y2 - y1) / 3;

  const xA = x1 + dx;
  const yA = y1 + dy;
  const xB = x1 + 2 * dx;
  const yB = y1 + 2 * dy;

  const angle = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 3;
  const xC = xA + Math.cos(angle) * Math.hypot(dx, dy);
  const yC = yA + Math.sin(angle) * Math.hypot(dx, dy);

  drawKoch(canvas, x1, y1, xA, yA, depth - 1);
  drawKoch(canvas, xA, yA, xC, yC, depth - 1);
  drawKoch(canvas, xC, yC, xB, yB, depth - 1);
  drawKoch(canvas, xB, yB, x2, y2, depth - 1);
}

// Draw Koch Snowflake
function drawKochSnowflake(canvas, x, y, size, depth) {
  const height = Math.sqrt(3) / 2 * size;
  const x1 = x;
  const y1 = y;
  const x2 = x + size;
  const y2 = y;
  const x3 = x + size / 2;
  const y3 = y - height;

  drawKoch(canvas, x1, y1, x2, y2, depth);
  drawKoch(canvas, x2, y2, x3, y3, depth);
  drawKoch(canvas, x3, y3, x1, y1, depth);
}

// Example usage
const width = 80;
const height = 40;
let canvas = createCanvas(width, height);

console.log("Fractal Tree:");
draw_tree(canvas, Math.floor(width / 2), height - 1, 6, 4);
printCanvas(canvas);

console.log("Sierpinski Triangle:");
canvas = createCanvas(width, height);
draw_sierpinski_triangle(canvas, 10, 30, 70, 30, 40, 2, 4);
printCanvas(canvas);

console.log("Koch Snowflake:");
canvas = createCanvas(width, height);
drawKochSnowflake(canvas, 10, 30, 60, 3);
printCanvas(canvas);
