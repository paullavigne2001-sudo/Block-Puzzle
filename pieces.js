const SHAPES = [
  [[1]],
  [[1,1]],
  [[1],[1]],
  [[1,1,1]],
  [[1],[1],[1]],
  [[1,1],[1,1]],
  [[1,0],[1,1]],
  [[0,1],[1,1]]
];

let pieces = [];

function createPiece() {
  const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    matrix: shape,
    color: '#' + Math.floor(Math.random()*16777215).toString(16),
    used: false
  };
}

function generatePieces() {
  pieces = [createPiece(), createPiece(), createPiece()];
}
