const boardEl = document.getElementById('board');
const restartBtn = document.getElementById('restartBtn');

function render() {
  boardEl.innerHTML = '';

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      const value = board[y][x];

      if (value && value.type !== 'obstacle') {
        cell.classList.add('filled');
        cell.style.background = value;
      }

      if (value && value.type === 'obstacle') {
        cell.classList.add('obstacle');
      }

      cell.onclick = () => place(x, y);

      boardEl.appendChild(cell);
    }
  }
}

function place(x, y) {
  if (board[y][x]) return;

  board[y][x] = '#' + Math.floor(Math.random() * 16777215).toString(16);

  clearLines();
  render();
}

function restart() {
  createBoardData();
  placeObstacles();
  render();
}

restartBtn.addEventListener('click', restart);

restart();
