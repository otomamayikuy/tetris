const blocks = [
    [
      [1, 1],
      [1, 1]
    ],
    [
      [0, 2, 0],
      [2, 2, 2]
    ],
    [
      [3],
      [3],
      [3],
      [3]
    ],
    [
      [4, 4, 0],
      [0, 4, 4]
    ],
    [
      [0, 5, 5],
      [5, 5, 0]
    ],
    [
      [6, 6],
      [6, 0],
      [6, 0]
    ],
    [
      [7, 0],
      [7, 0],
      [7, 7]
    ]
];

const colors = [
  "#ff0000", "#00ff00", "#0000ff", "#999999", "#ffff00", "#ff00ff", "#00ffff"
]

const BLOCK_SIZE = 20;
const ROWS = 20;
const COLS = 10;

const scoreBoard = document.getElementById("score")
let score = 0

const startButton = document.getElementById("start-button");

const nextCanvas = document.getElementById("next-canvas");
const nextCtx = nextCanvas.getContext("2d");
nextCanvas.setAttribute("height", BLOCK_SIZE*4);

const firstNumber = Math.floor(Math.random()*blocks.length)
let currentBlock = {
  color: colors[firstNumber],
  shape: blocks[firstNumber],
  x: 0,
  y: -blocks[firstNumber].length
};

let beforeBlock = {
  color: colors[firstNumber],
  shape: blocks[firstNumber],
  x: 0,
  y: -blocks[firstNumber].length
};

const nextNumber = Math.floor(Math.random()*blocks.length)
let nextBlock = {
  color: colors[nextNumber],
  shape: blocks[nextNumber],
  x: 0,
  y: -blocks[nextNumber].length
};

let gameBoard = [];
for (let i = 0; i < ROWS; i++) {
  gameBoard[i] = new Array(COLS).fill(0);
}

const boardCanvas = document.getElementById("board-canvas");
boardCanvas.setAttribute("height", BLOCK_SIZE*ROWS);
boardCanvas.setAttribute("width", BLOCK_SIZE*COLS);
const boardCtx = boardCanvas.getContext("2d");
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    boardCtx.fillStyle = "#000000";
    boardCtx.fillRect(
      (col) * BLOCK_SIZE,
      (row) * BLOCK_SIZE,
      BLOCK_SIZE,
      BLOCK_SIZE
    );
  }
}

function nextUpdate() {
  nextCanvas.setAttribute("width", BLOCK_SIZE*nextBlock.shape[0].length);
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  for (let row = 0; row < nextBlock.shape.length; row++) { 
    for (let col = 0; col < nextBlock.shape[row].length; col++) {
      if (nextBlock.shape[row][col] !== 0) {
        nextCtx.fillStyle = nextBlock.color;
        nextCtx.fillRect(
          (col) * BLOCK_SIZE,
          (row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function updateCanvas() {
  eraseBlock()
  beforeBlock.shape = currentBlock.shape
  beforeBlock.x = currentBlock.x
  beforeBlock.y = currentBlock.y
  drawBlock(currentBlock)
}
  
function moveLeft() {
  if(!isCollision(currentBlock, -1, 0)){
    currentBlock.x--;
  }
}
  
function moveRight() {
  if(!isCollision(currentBlock, 1, 0)){
    currentBlock.x++;
  }
}

function rotateBlock() {
  let rotatedBlock = {
    shape: [],
    x: currentBlock.x,
    y: currentBlock.y
  };

  for (let row = 0; row < currentBlock.shape[0].length; row++) {
    rotatedBlock.shape[row] = [];
    for (let col = 0; col < currentBlock.shape.length; col++) {
      rotatedBlock.shape[row][col] = currentBlock.shape[currentBlock.shape.length - col - 1][row];
    }
  }

  if (!isCollision(rotatedBlock, 0, 0)) {
    currentBlock.shape = rotatedBlock.shape;
  }
}

function drawBlock(block) {
  for (let row = 0; row < block.shape.length; row++) {
    for (let col = 0; col < block.shape[row].length; col++) {
      if (block.shape[row][col] !== 0) {
        boardCtx.fillStyle = colors[block.shape[row][col]-1];
        boardCtx.fillRect(
          (block.x + col) * BLOCK_SIZE,
          (block.y + row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function eraseBlock() {
  for (let row = 0; row < beforeBlock.shape.length; row++) {
    for (let col = 0; col < beforeBlock.shape[row].length; col++) {
      if (beforeBlock.shape[row][col] !== 0) {
        boardCtx.fillStyle = "#000000";
        boardCtx.fillRect(
          (beforeBlock.x + col) * BLOCK_SIZE,
          (beforeBlock.y + row) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function moveBlockDown() {
  if(!isCollision(currentBlock, 0, 1)){
    eraseBlock()
    currentBlock.y++;
  } else {
    for (let row = 0; row < currentBlock.shape.length; row++) {
      for (let col = 0; col < currentBlock.shape[row].length; col++) {
        if (currentBlock.shape[row][col] !== 0) {
          if(currentBlock.y + row >= 0) {
            gameBoard[currentBlock.y + row][currentBlock.x + col] = currentBlock.shape[row][col]
            
          }
        }
      }
    }
    fixBlock(currentBlock)
    currentBlock = nextBlock
    let newNumber = Math.floor(Math.random()*blocks.length)
    nextBlock = {
      color: colors[newNumber],
      shape: blocks[newNumber],
      x: 0,
      y: -blocks[newNumber].length
    };
    nextUpdate()
  }
}

function isCollision(block, offsetX, offsetY) {
  for (let row = 0; row < block.shape.length; row++) {
    for (let col = 0; col < block.shape[row].length; col++) {
      if (block.shape[row][col] !== 0) {
        let x = block.x + col + offsetX;
        let y = block.y + row + offsetY;
        if (y >= ROWS || x < 0 || x >= COLS) {
          return true;
        }
        if (y >= 0 && gameBoard[y][x]) {
          return true;
        }
      }
    }
  }
  return false;
}

function fixBlock(block) {
  for (let row = 0; row < block.shape.length; row++) {
    for (let col = 0; col < block.shape[row].length; col++) {
      if (block.shape[row][col] !== 0) {
        let y = block.y + row;
        if (y < 0) {
          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              boardCtx.fillStyle = "#000000";
              boardCtx.fillRect(
                (col) * BLOCK_SIZE,
                (row) * BLOCK_SIZE,
                BLOCK_SIZE,
                BLOCK_SIZE
              );
            }
          }
          for (let i = 0; i < ROWS; i++) {
            gameBoard[i] = new Array(COLS).fill(0);
          }
          alert("Game Over");
          location.reload();
          return;
        }
      }
    }
  }

  let fullRows = [];
  for (let row = 0; row < ROWS; row++) {
    if (gameBoard[row].every((value) => value)) {
      fullRows.push(row);
    }
  }

  if (fullRows.length > 0) {
    score += 100*fullRows.length + 50*(fullRows.length-1)
    scoreBoard.innerText = score
    for (let i = 0; i < fullRows.length; i++) {
      gameBoard.splice(fullRows[i], 1);
      gameBoard.unshift(new Array(COLS).fill(0));
    }
  }
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (gameBoard[row][col] === 0){
        boardCtx.fillStyle = "#000000";
      } else {
        boardCtx.fillStyle = colors[gameBoard[row][col]-1];
      }
      boardCtx.fillRect(
        (col) * BLOCK_SIZE,
        (row) * BLOCK_SIZE,
        BLOCK_SIZE,
        BLOCK_SIZE
      );
    }
  }
}

function start(){
  startButton.style.display = "none";
  document.addEventListener("keydown", function(event) {
    if (event.code === "ArrowLeft") {
      moveLeft();
      updateCanvas();
    } else if (event.code === "ArrowRight") {
      moveRight();
      updateCanvas();
    } else if (event.code === "ArrowUp") {
      rotateBlock();
      updateCanvas();
    } else if (event.code === "ArrowDown") {
      moveBlockDown();
      beforeBlock.shape = currentBlock.shape
      beforeBlock.x = currentBlock.x
      beforeBlock.y = currentBlock.y
      drawBlock(currentBlock);
    }
  });

  drawBlock(currentBlock);
  nextUpdate()

  setInterval(function() {
    moveBlockDown();
    beforeBlock.shape = currentBlock.shape
    beforeBlock.x = currentBlock.x
    beforeBlock.y = currentBlock.y
    drawBlock(currentBlock);
  }, 400);
}