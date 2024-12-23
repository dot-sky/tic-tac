/*
gameboard
    gameboard is an array 
player
gamecontroller

*/
function GameBoard() {
  let board = [];
  const BOARD_SIZE = 3;
  createBoard();
  resetBoard();

  function createBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i].push(Cell());
      }
    }
  }

  function resetBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = Cell();
      }
    }
  }

  function displayBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      let boardRow = "";
      for (let j = 0; j < BOARD_SIZE; j++) {
        boardRow += board[i][j].getValue() + " ";
      }
      console.log(boardRow);
    }
  }
  const isValidCell = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };
  function makeMove(marker, pos) {
    /* pos = position from top left corner */
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    if (isValidCell(row, col) && board[row][col].isFree()) {
      board[row][col].setValue(marker);
    } else {
      console.log("Invalid move... try again");
    }
    // checkWin conditions
  }

  return { displayBoard, makeMove };
}

function Cell() {
  let value = "-";
  const getValue = () => value;
  const setValue = (marker) => {
    value = marker;
  };
  const isFree = () => {
    return value === "-";
  };
  return { getValue, setValue, isFree };
}

function Player(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker };
}

const gameController = (function () {
  const gameBoard = GameBoard();
  const players = [];
  players.push(Player("First", "X"));
  players.push(Player("Second", "O"));

  // player turn
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playTurn = (pos) => {
    console.log(`${activePlayer.getName()} plays on position ${pos}`);

    const winState = gameBoard.makeMove(activePlayer.getMarker(), pos);
    gameBoard.displayBoard();
    if (winState) {
      console.log("Game has ended");
      console.log(activePlayer, "has won");
    }

    switchPlayer();
    showGameState();
  };

  const showGameState = () => {
    gameBoard.displayBoard;
    console.log(`Waiting move of ${activePlayer.getName()}...`);
  };

  return { playTurn, getActivePlayer };
})();
