const boardEl = document.getElementById('board');
const trayEl = document.getElementById('tray');
const restartBtn = document.getElementById('restartBtn');

let dragPiece=null, dragElement=null;

function getCell(x,y){
  return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

/* RENDER */
function render(){
  boardEl.innerHTML='';

  for(let y=0;y<SIZE;y++){
    for(let x=0;x<SIZE;x++){
      let c=document.createElement('div');
      c.className='cell';
      c.dataset.x=x; c.dataset.y=y;

      let v=board[y][x];

      if(v?.type==='obstacle'){
        c.classList.add('obstacle');
        if(v.hp===1)c.classList.add('crack1');
      }

      if(v && v.type!=='obstacle'){
        c.classList.add('filled');
        c.style.background=v;
      }

      boardEl.appendChild(c);
    }
  }
}

/* PREVIEW */
function clearPreview(){
  document.querySelectorAll('.cell').forEach(c=>{
    c.classList.remove('preview-ok','preview-bad');
  });
}

function showPreview(piece,x,y){
  clearPreview();
  if(piece.bonus) return true;

  let valid=true, cells=[];

  for(let dy=0;dy<piece.matrix.length;dy++){
    for(let dx=0;dx<piece.matrix[0].length;dx++){
      if(!piece.matrix[dy][dx])continue;

      let px=x+dx, py=y+dy;

      if(px>=SIZE||py>=SIZE||board[py][px]){
        valid=false; continue;
      }

      let c=getCell(px,py);
      if(c)cells.push(c);
    }
  }

  cells.forEach(c=>c.classList.add(valid?'preview-ok':'preview-bad'));
  return valid;
}

/* PIECES */
function renderPieces(){
  trayEl.innerHTML='';

  pieces.forEach(p=>{
    if(p.used)return;

    let el=document.createElement('div');
    el.className='piece';

    if(p.bonus){
      el.textContent='★';
    }else{
      el.style.gridTemplateColumns=`repeat(${p.matrix[0].length},20px)`;
      p.matrix.forEach(r=>{
        r.forEach(c=>{
          let t=document.createElement('div');
          t.className='tile';
          t.style.visibility=c?'visible':'hidden';
          t.style.background=p.color;
          el.appendChild(t);
        });
      });
    }

    el.onmousedown=e=>startDrag(e,p,el);
    trayEl.appendChild(el);
  });
}

/* DRAG */
function startDrag(e,piece,el){
  dragPiece=piece;
  dragElement=el.cloneNode(true);
  dragElement.classList.add('drag-preview');
  document.body.appendChild(dragElement);
  moveDrag(e);
  document.addEventListener('mousemove',moveDrag);
}

function moveDrag(e){
  if(!dragElement)return;
  dragElement.style.left=e.clientX+'px';
  dragElement.style.top=e.clientY+'px';
}

document.addEventListener('mouseup',e=>{
  if(!dragPiece)return;

  document.removeEventListener('mousemove',moveDrag);
  dragElement?.remove(); dragElement=null;

  const rect=boardEl.getBoundingClientRect();
  const x=Math.floor((e.clientX-rect.left)/44);
  const y=Math.floor((e.clientY-rect.top)/44);

  if(x>=0&&y>=0&&x<SIZE&&y<SIZE){
    if(dragPiece.bonus){
      applyBonus(dragPiece.bonus,x,y);
    } else if(showPreview(dragPiece,x,y)){
      placePiece(dragPiece,x,y);
    }
  }

  dragPiece.used=true;
  clearPreview();
  render();
  renderPieces();

  if(pieces.every(p=>p.used)){
    generatePieces();
    renderPieces();
  }

  dragPiece=null;
});

/* GAMEPLAY */
function placePiece(piece,x,y){
  for(let dy=0;dy<piece.matrix.length;dy++){
    for(let dx=0;dx<piece.matrix[0].length;dx++){
      if(piece.matrix[dy][dx]){
        board[y+dy][x+dx]=piece.color;
      }
    }
  }
  clearLines();
}

/* INIT */
function restart(){
  createBoardData();
  placeObstacles();
  generatePieces();
  render();
  renderPieces();
}

restartBtn.addEventListener('click',restart);
restart();
