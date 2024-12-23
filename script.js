/*
gameboard
    gameboard is an array 
player
gamecontroller

*/
const gameBoard = (function () {
  let board = [];
  const BOARD_SIZE = 3;
  createBoard();
  resetBoard();
  function createBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i].push("-");
      }
    }
  }
  function resetBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        board[i][j] = "-";
      }
    }
  }
  function displayBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      let boardRow = "";
      for (let j = 0; j < BOARD_SIZE; j++) {
        boardRow += board[i][j] + " ";
      }
      console.log(boardRow);
    }
  }
  function makeMove(player, marker) {}
  function checkWin(player, marker) {}
  return { displayBoard };
})();
