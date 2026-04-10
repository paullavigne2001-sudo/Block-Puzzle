const boardEl = document.getElementById('board');
const trayEl = document.getElementById('tray');
const restartBtn = document.getElementById('restartBtn');

let dragPiece = null;
let dragElement = null;

/* =========================
   RENDER BOARD
========================= */
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

      cell.dataset.x = x;
      cell.dataset.y = y;

      boardEl.appendChild(cell);
    }
  }
}

/* =========================
   PREVIEW
========================= */
function clearPreview() {
  document.querySelectorAll('.cell').forEach(c => {
    c.classList.remove('preview-ok', 'preview-bad');
  });
}

function showPreview(piece, x, y) {
  clearPreview();

  let valid = true;
  const cells = [];

  for (let dy = 0; dy < piece.matrix.length; dy++) {
    for (let dx = 0; dx < piece.matrix[0].length; dx++) {
      if (!piece.matrix[dy][dx]) continue;

      const px = x + dx;
      const py = y + dy;

      if (px >= SIZE || py >= SIZE || board[py][px]) {
        valid = false;
        continue;
      }

      const cell = getCell(px, py);
      if (cell) cells.push(cell);
    }
  }

  cells.forEach(c => {
    c.classList.add(valid ? 'preview-ok' : 'preview-bad');
  });

  return valid;
}

function getCell(x, y) {
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

/* =========================
   PIECES
========================= */
function renderPieces() {
  trayEl.innerHTML = '';

  pieces.forEach((p) => {
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

    el.onmousedown = (e) => startDrag(e, p, el);

    trayEl.appendChild(el);
  });
}

/* =========================
   DRAG
========================= */
function startDrag(e, piece, element) {
  dragPiece = piece;

  dragElement = element.cloneNode(true);
  dragElement.classList.add('drag-preview');
  dragElement.style.gridTemplateColumns = element.style.gridTemplateColumns;

  document.body.appendChild(dragElement);

  moveDrag(e);

  document.addEventListener('mousemove', moveDrag);
}

function moveDrag(e) {
  if (!dragElement) return;

  dragElement.style.left = e.clientX + 'px';
  dragElement.style.top = e.clientY + 'px';

  const rect = boardEl.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 44);
  const y = Math.floor((e.clientY - rect.top) / 44);

  if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) {
    showPreview(dragPiece, x, y);
  } else {
    clearPreview();
  }
}

document.addEventListener('mouseup', (e) => {
  if (!dragPiece) return;

  document.removeEventListener('mousemove', moveDrag);

  if (dragElement) {
    dragElement.remove();
    dragElement = null;
  }

  const rect = boardEl.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / 44);
  const y = Math.floor((e.clientY - rect.top) / 44);

  if (x >= 0 && y >= 0 && x < SIZE && y < SIZE) {
    const valid = showPreview(dragPiece, x, y);
    if (valid) placePiece(dragPiece, x, y);
  }

  clearPreview();
  dragPiece = null;
});

/* =========================
   GAMEPLAY
========================= */
function placePiece(piece, x, y) {
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

/* =========================
   INIT
========================= */
function restart() {
  createBoardData();
  placeObstacles();
  generatePieces();
  render();
  renderPieces();
}

restartBtn.addEventListener('click', restart);
restart();
