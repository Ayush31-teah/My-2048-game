st board = document.getElementById("board");
const scoreDisplay = document.getElementById("score");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");

let grid, score;

function startGame() {
  grid = Array(5).fill().map(() => Array(5).fill(0));
  score = 0;
  randomTile();
  randomTile();
  drawBoard();
  message.textContent = "";
  scoreDisplay.textContent = score;
}

function drawBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      const value = grid[r][c];
      if (value) {
        tile.textContent = value;
        tile.classList.add("x" + value);
      }
      board.appendChild(tile);
    }
  }
  scoreDisplay.textContent = score;
}

function randomTile() {
  let empty = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (grid[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length) {
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }
}

function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter(v => v);
  while (row.length < 5) row.push(0);
  return row;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < 5; r++) {
    let old = [...grid[r]];
    grid[r] = slide(grid[r]);
    if (old.toString() !== grid[r].toString()) moved = true;
  }
  if (moved) {
    randomTile();
    drawBoard();
    checkGameStatus();
  }
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < 5; r++) {
    let old = [...grid[r]];
    grid[r] = slide(grid[r].reverse()).reverse();
    if (old.toString() !== grid[r].toString()) moved = true;
  }
  if (moved) {
    randomTile();
    drawBoard();
    checkGameStatus();
  }
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < 5; c++) {
    let col = grid.map(row => row[c]);
    let old = [...col];
    col = slide(col);
    for (let r = 0; r < 5; r++) grid[r][c] = col[r];
    if (old.toString() !== col.toString()) moved = true;
  }
  if (moved) {
    randomTile();
    drawBoard();
    checkGameStatus();
  }
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < 5; c++) {
    let col = grid.map(row => row[c]).reverse();
    let old = [...col];
    col = slide(col);
    col.reverse();
    for (let r = 0; r < 5; r++) grid[r][c] = col[r];
    if (old.reverse().toString() !== col.toString()) moved = true;
  }
  if (moved) {
    randomTile();
    drawBoard();
    checkGameStatus();
  }
}

function checkGameStatus() {
  // Win check
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (grid[r][c] === 2048) {
        message.textContent = "🎉 You Win!";
        document.removeEventListener("keydown", handleKeys);
        return;
      }
    }
  }

  // Lose check
  let movesAvailable = false;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (grid[r][c] === 0) return;
      if (r < 4 && grid[r][c] === grid[r + 1][c]) movesAvailable = true;
      if (c < 4 && grid[r][c] === grid[r][c + 1]) movesAvailable = true;
    }
  }
  if (!movesAvailable) {
    message.textContent = "💀 Game Over!";
    document.removeEventListener("keydown", handleKeys);
  }
}

function handleKeys(e) {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
}

document.addEventListener("keydown", handleKeys);
restartBtn.addEventListener("click", () => {
  document.addEventListener("keydown", handleKeys);
  startGame();
});

// ********* MOBILE TOUCH/SWIPE SUPPORT *********

let touchstartX = 0;
let touchendX = 0;
let touchstartY = 0;
let touchendY = 0;

const gameContainer = document.getElementById('game-container'); // Game container ko id se le lo

gameContainer.addEventListener('touchstart', e => {
    touchstartX = e.changedTouches[0].screenX;
    touchstartY = e.changedTouches[0].screenY;
}, false);

gameContainer.addEventListener('touchend', e => {
    touchendX = e.changedTouches[0].screenX;
    touchendY = e.changedTouches[0].screenY;
    handleGesture();
}, false);

function handleGesture() {
    const deltaX = touchendX - touchstartX;
    const deltaY = touchendY - touchstartY;

    // Check ki swipe vertical tha ya horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal Swipe
        if (deltaX > 30) {
            moveRight();
        } else if (deltaX < -30) {
            moveLeft();
        }
    } else {
        // Vertical Swipe
        if (deltaY > 30) {
            moveDown();
        } else if (deltaY < -30) {
            moveUp();
        }
    }
}

// Ensure handleKeys is attached (yeh already hai, bas check kar lo)
document.addEventListener("keydown", handleKeys); 

// Restart button ka event listener (yeh bhi already hai)
restartBtn.addEventListener("click", () => {
    document.addEventListener("keydown", handleKeys);
    startGame();
});

// Game shuru karo (yeh bhi already hai)
startGame();
