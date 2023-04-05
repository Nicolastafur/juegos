const ROW = 20;
const COLUMN = 10;

let canvasBoard = document.getElementById('board-canvas');
let contextBoard = canvasBoard.getContext('2d');
let canvasPiece = document.getElementById('piece-canvas');
let contextPiece = canvasPiece.getContext('2d');
let scoreElement = document.getElementById('score');
let intervalId;
let board;
let currentPiece;
let currentPiecePosition;
let score = 0;

function createBoard() {
  board = new Array(ROW).fill(null).map(() => new Array(COLUMN).fill(null));
}

function drawBoard() {
  contextBoard.clearRect(0, 0, canvasBoard.width, canvasBoard.height);
  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== null) {
        contextBoard.fillStyle = getColor(value);
        contextBoard.fillRect(c * 20, r * 20, 20, 20);
      }
    });
  });
}

function drawPiece() {
  contextPiece.clearRect(0, 0, canvasPiece.width, canvasPiece.height);
  currentPiece.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value) {
        contextPiece.fillStyle = getColor(value);
        contextPiece.fillRect(
          (currentPiecePosition.x + c) * 20,
          (currentPiecePosition.y + r) * 20,
          20,
          20
        );
      }
    });
  });
}

function getColor(value) {
  switch (value) {
    case 1:
      return '#FF0D72';
    case 2:
      return '#0DC2FF';
    case 3:
      return '#0DFF72';
    case 4:
      return '#F538FF';
    case 5:
      return '#FF8E0D';
    case 6:
      return '#FFE138';
    case 7:
      return '#3877FF';
    default:
      return '#000';
  }
}

function getRandomPiece() {
  const pieces = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [2, 2, 0],
      [0, 2, 2],
      [0, 0, 0],
    ],
    [
      [0, 3, 3],
      [3, 3, 0],
      [0, 0, 0],
    ],
    [
      [4, 4, 0],
      [0, 4, 4],
      [0, 0, 0],
    ],
    [
      [0, 5, 0],
      [5, 5, 5],
      [0, 0, 0],
    ],
    [
      [6, 6, 6, 6],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 7],
      [7, 7, 7],
      [0, 0, 0],
    ],
  ];

  const randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}

function canMove(piece, position) {
    return piece.every((row, r) => {
      return row.every((value, c) => {
        const rowPosition = position.y + r;
        const colPosition = position.x + c;
        if (value === 0)       return true;
        if (
          rowPosition < 0 ||
          rowPosition >= ROW ||
          colPosition < 0 ||
          colPosition >= COLUMN ||
          board[rowPosition][colPosition] !== null
        ) {
          return false;
        }
        return true;
      });
    });
  }
  
  function mergePiece() {
    currentPiece.forEach((row, r) => {
      row.forEach((value, c) => {
        if (value) {
          const rowPosition = currentPiecePosition.y + r;
          const colPosition = currentPiecePosition.x + c;
          board[rowPosition][colPosition] = value;
        }
      });
    });
  }
  
  function checkLines() {
    let lines = 0;
    board.forEach((row, r) => {
      if (row.every((value) => value !== null)) {
        lines++;
        board.splice(r, 1);
        board.unshift(new Array(COLUMN).fill(null));
      }
    });
  
    score += lines * 10;
    scoreElement.innerHTML = score;
  }
  
  function gameover() {
    clearInterval(intervalId);
    alert('Game Over!');
  }
  
  function dropPiece() {
    const newPosition = {
      ...currentPiecePosition,
      y: currentPiecePosition.y + 1,
    };
  
    if (canMove(currentPiece, newPosition)) {
      currentPiecePosition = newPosition;
    } else {
      mergePiece();
      checkLines();
      currentPiece = getRandomPiece();
      currentPiecePosition = { x: 3, y: 0 };
  
      if (!canMove(currentPiece, currentPiecePosition)) {
        gameover();
        return;
      }
    }
  
    drawBoard();
    drawPiece();
  }
  
  function startGame() {
    createBoard();
    drawBoard();
  
    currentPiece = getRandomPiece();
    currentPiecePosition = { x: 3, y: 0 };
    drawPiece();
  
    intervalId = setInterval(() => {
      dropPiece();
    }, 1000);
  
    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 37) {
        const newPosition = {
          ...currentPiecePosition,
          x: currentPiecePosition.x - 1,
        };
        if (canMove(currentPiece, newPosition)) {
          currentPiecePosition = newPosition;
          drawPiece();
        }
      } else if (event.keyCode === 39) {
        const newPosition = {
          ...currentPiecePosition,
          x: currentPiecePosition.x + 1,
        };
        if (canMove(currentPiece, newPosition)) {
          currentPiecePosition = newPosition;
          drawPiece();
        }
      } else if (event.keyCode === 40) {
        dropPiece();
      } else if (event.keyCode === 38) {
        const rotatedPiece = currentPiece[0].map((val, index) =>
          currentPiece.map((row) => row[index]).reverse()
        );
        if (canMove(rotatedPiece, currentPiecePosition)) {
          currentPiece = rotatedPiece;
          drawPiece();
        }
      }
    });
  }
  
  function stopGame() {
    clearInterval(intervalId);
  }
  
  let startButton = document.getElementById('start-button');
  startButton.addEventListener('click', startGame);
  
  let stopButton = document.getElementById('stop-button');
  stopButton.addEventListener('click', stopGame);
  
          