const SIZE = 9;
let board = [];

function createBoardData() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function placeObstacles() {
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);
    board[y][x] = { type: 'obstacle', hp: 2 };
  }
}

/* BONUS EFFECTS */
function applyBonus(type, x, y) {
  if (type === 'hammer') {
    damageObstacle(x, y);
  }

  if (type === 'bomb') {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        damageObstacle(x + dx, y + dy);
        if (board[y+dy]?.[x+dx] && board[y+dy][x+dx].type !== 'obstacle') {
          board[y+dy][x+dx] = null;
        }
      }
    }
  }

  if (type === 'laser') {
    for (let i = 0; i < SIZE; i++) {
      board[y][i] = null;
      damageObstacle(i, y);
    }
  }

  if (type === 'star') {
    // simple score bonus (placeholder)
    console.log('⭐ bonus score');
  }
}

function damageObstacle(x, y) {
  if (x<0||y<0||x>=SIZE||y>=SIZE) return;
  const cell = board[y][x];
  if (!cell || cell.type !== 'obstacle') return;

  cell.hp--;
  if (cell.hp <= 0) board[y][x] = null;
}

function clearLines() {
  for (let y = 0; y < SIZE; y++) {
    if (board[y].every(v => v && v.type !== 'obstacle')) {
      for (let x = 0; x < SIZE; x++) board[y][x] = null;
    }
  }
}
