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

  function makeMove(player, marker) {}

  return { displayBoard, makeMove };
}

function Cell() {
  let value = "-";
  const getValue = () => value;
  const setValue = (marker) => {
    value = marker;
  };
  return { getValue, setValue };
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

    const winState = gameBoard.playTurn(currPlayer.getMarker(), pos);
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
