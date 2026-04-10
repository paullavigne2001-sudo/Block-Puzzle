const SHAPES = [
  [[1]], [[1,1]], [[1],[1]],
  [[1,1,1]], [[1],[1],[1]],
  [[1,1],[1,1]]
];

const BONUS_TYPES = ['hammer','bomb','laser','star'];

let pieces = [];

function createPiece() {
  if (Math.random() < 0.25) {
    return {
      bonus: BONUS_TYPES[Math.floor(Math.random()*BONUS_TYPES.length)],
      used:false
    };
  }

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
