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

function clearLines() {
  for (let y = 0; y < SIZE; y++) {
    if (board[y].every(v => v && v.type !== 'obstacle')) {
      for (let x = 0; x < SIZE; x++) board[y][x] = null;
    }
  }
}
