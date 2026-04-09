const boardEl = document.getElementById('board');
const trayEl = document.getElementById('tray');
const restartBtn = document.getElementById('restartBtn');

let dragPiece = null;

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

      boardEl.appendChild(cell);
    }
  }
}

function renderPieces() {
  trayEl.innerHTML = '';

  pieces.forEach((p, index) => {
    if (p.used) return;

    const el = document.createElement('div');
    el.className = 'piece';

    el.style.gridTemplateColumns = `repeat(${p.matrix[0].length}, 20px)`;

    p.matrix.forEach(row => {
      row.forEach(cell => {
        const t = document.createElement('div');
        t.className = 'tile';
        t.style.visibility = cell ? 'visible' : 'hidden';
        t.style.background = p.color;
        el.appendChild(t);
      });
    });

    el.onmousedown = (e) => startDrag(e, p);

    trayEl.appendChild(el);
  });
}

function startDrag(e, piece) {
  dragPiece = piece;
}

document.addEventListener('mouseup', (e) => {
  if (!dragPiece) return;

  const rect = boardEl.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 44);
  const y = Math.floor((e.clientY - rect.top) / 44);

  if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) {
    placePiece(dragPiece, x, y);
  }

  dragPiece = null;
});

function placePiece(piece, x, y) {
  for (let dy = 0; dy < piece.matrix.length; dy++) {
    for (let dx = 0; dx < piece.matrix[0].length; dx++) {
      if (!piece.matrix[dy][dx]) continue;

      const px = x + dx;
      const py = y + dy;

      if (px >= SIZE || py >= SIZE) return;
      if (board[py][px]) return;
    }
  }

  for (let dy = 0; dy < piece.matrix.length; dy++) {
    for (let dx = 0; dx < piece.matrix[0].length; dx++) {
      if (!piece.matrix[dy][dx]) continue;
      board[y + dy][x + dx] = piece.color;
    }
  }

  piece.used = true;

  clearLines();
  render();
  renderPieces();

  if (pieces.every(p => p.used)) {
    generatePieces();
    renderPieces();
  }
}

function restart() {
  createBoardData();
  placeObstacles();
  generatePieces();
  render();
  renderPieces();
}

restartBtn.addEventListener('click', restart);

restart();
