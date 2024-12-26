function GameBoard() {
  let board = [];
  const BOARD_SIZE = 3;
  let freeCells;
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
    freeCells = BOARD_SIZE * BOARD_SIZE;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = Cell();
      }
    }
  }

  function displayBoard() {
    let boardString = "";
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        boardString += board[i][j].getValue() + " ";
      }
      boardString += "\n";
    }
    console.log(boardString);
  }
  const isValidCell = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };
  const makeMove = (marker, pos) => {
    /* pos = position from top left corner */
    const row = Math.floor(pos / 3);
    const col = pos % 3;
    let validMove;
    let draw = false;
    if (isValidCell(row, col) && board[row][col].isFree()) {
      board[row][col].setValue(marker);
      validMove = true;
      freeCells--;
      if (freeCells === 0) {
        draw = true;
      }
    } else {
      console.log("Invalid move... try again");
      validMove = false;
    }
    const winState = checkWin();
    return { validMove, draw, ...winState };
  };
  const checkWin = () => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      let win = true;
      // first cell is empty, no need to check the rest
      // check row
      if (!board[i][0].isFree()) {
        for (let j = 1; j < BOARD_SIZE; j++) {
          if (board[i][0].getValue() !== board[i][j].getValue()) win = false;
        }
        if (win) return { win: true, winType: "row", index: i };
      }
      // check col
      if (!board[0][i].isFree()) {
        win = true;
        for (let j = 1; j < BOARD_SIZE; j++) {
          if (board[0][i].getValue() !== board[j][i].getValue()) win = false;
        }
        if (win) return { win: true, winType: "col", index: i };
      }
    }

    // check diag
    let win = true;
    if (!board[0][0].isFree()) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        if (board[0][0].getValue() !== board[i][i].getValue()) win = false;
      }
      if (win) return { win: true, winType: "diag" };
    }
    win = true;
    if (!board[0][BOARD_SIZE - 1].isFree()) {
      for (let i = 1; i < BOARD_SIZE; i++) {
        if (
          board[0][BOARD_SIZE - 1].getValue() !==
          board[i][BOARD_SIZE - i - 1].getValue()
        )
          win = false;
      }
      if (win) return { win: true, winType: "secondDiag" };
    }
    return { win: false, winType: "none" };
  };

  return { displayBoard, makeMove, resetBoard };
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
  let activePlayer;
  let activeRound;

  const startGame = () => {
    activePlayer = players[0];
    activeRound = true;
  };

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playTurn = (pos) => {
    if (!activeRound) {
      console.log("Round has already ended");
      return;
    }
    console.log(`${activePlayer.getName()} plays on position ${pos}`);
    const gameState = gameBoard.makeMove(activePlayer.getMarker(), pos);

    if (gameState.validMove && (gameState.win || gameState.draw)) {
      finishRound(gameState.draw);
    } else if (gameState.validMove) {
      switchPlayer();
      showGameState();
    } else {
      showGameState();
    }
  };

  const finishRound = (draw) => {
    gameBoard.displayBoard();
    let finishMsg;
    if (draw) {
      finishMsg = `Game has ended in a draw!`;
    } else {
      finishMsg = `${activePlayer.getName()} has won the game!`;
    }
    console.log(finishMsg);
    activeRound = false;
  };

  const newRound = () => {
    console.log("Restarting board...");
    gameBoard.resetBoard();
    startGame();
  };

  const showGameState = () => {
    gameBoard.displayBoard();
    console.log(`Waiting move of ${activePlayer.getName()}...`);
  };

  newRound();
  return { playTurn, getActivePlayer, newRound };
})();
// player 1 wins diag
gameController.playTurn(4);
gameController.playTurn(1);
gameController.playTurn(2);
gameController.playTurn(0);
gameController.playTurn(6);

gameController.newRound();

// player 2 wins col
// check this game state win isn't correctly recognized
gameController.playTurn(8);
gameController.playTurn(0);
gameController.playTurn(2);
gameController.playTurn(3);
gameController.playTurn(1);
gameController.playTurn(6);
// player 1 wins row
gameController.newRound();
// gameController.playTurn(8);
// gameController.playTurn(3);
// gameController.playTurn(2);
// gameController.playTurn(4);
// gameController.playTurn(1);
// gameController.playTurn(5);
// gameController.playTurn(3);
// draw
// gameController.playTurn(4);
// gameController.playTurn(1);
// gameController.playTurn(2);
// gameController.playTurn(0);
// gameController.playTurn(3);
// gameController.playTurn(6);
// gameController.playTurn(7);
// gameController.playTurn(5);
// gameController.playTurn(8);
