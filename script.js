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

  const getBoardSize = () => BOARD_SIZE;

  const getBoard = () => board;

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

  return { displayBoard, makeMove, resetBoard, getBoardSize, getBoard };
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
  const setName = (newName) => {
    name = newName;
  };
  const getMarker = () => marker;
  return { getName, setName, getMarker };
}

function GameController() {
  const gameBoard = GameBoard();
  const players = [];
  const wins = [0, 0];
  players.push(Player("Player 1", "X"));
  players.push(Player("Player 2", "O"));

  // player turn
  let activePlayer;
  let roundState;
  let roundNumber = 0;

  const startRound = () => {
    if (roundNumber % 2 == 0) {
      activePlayer = players[0];
    } else {
      activePlayer = players[1];
    }
    roundState = "playing";
    roundNumber++;
  };

  const getPlayer = (i) => players[i];

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const playTurn = (pos) => {
    if (isRoundFinished()) {
      console.log("Round has already ended");
      return;
    }
    console.log(`${activePlayer.getName()} plays on position ${pos}`);
    const gameState = gameBoard.makeMove(activePlayer.getMarker(), pos);

    if (gameState.validMove && (gameState.win || gameState.draw)) {
      finishRound(gameState.win, gameState.draw);
    } else if (gameState.validMove) {
      switchPlayer();
      showGameState();
    } else {
      showGameState();
    }
    return gameState;
  };

  const finishRound = (win, draw) => {
    gameBoard.displayBoard();
    let finishMsg;
    if (draw && !win) {
      finishMsg = `Game has ended in a draw!`;
      roundState = "draw";
    } else {
      finishMsg = `${activePlayer.getName()} has won the game!`;
      roundState = "win";
      addWin(activePlayer);
    }
    console.log(finishMsg);
  };

  const addWin = (player) => {
    if (player === players[0]) {
      wins[0]++;
    } else {
      wins[1]++;
    }
  };

  const getWins = (i) => wins[i];

  const newRound = () => {
    console.log("Restarting board...");
    gameBoard.resetBoard();
    startRound();
  };

  const showGameState = () => {
    // gameBoard.displayBoard();
    console.log(`Waiting move of ${activePlayer.getName()}...`);
  };

  const getRoundState = () => roundState;

  const isRoundFinished = () => roundState !== "playing";

  startRound();

  return {
    playTurn,
    newRound,
    getActivePlayer,
    getPlayer,
    getWins,
    getBoard: gameBoard.getBoard,
    getBoardSize: gameBoard.getBoardSize,
    getRoundState,
    isRoundFinished,
  };
}

const ScreenController = (function (doc) {
  const game = GameController();

  // load DOM
  const container = doc.querySelector("#board");
  const gameContainer = doc.querySelector(".game-container");
  const inputContainer = doc.querySelector("#input-wrapper");
  const boxP1 = doc.querySelector("#player-1-box");
  const boxP2 = doc.querySelector("#player-2-box");

  const msgBox = doc.querySelector("#msg");
  const p1Name = doc.querySelector("#p1-name");
  const p1Marker = doc.querySelector("#p1-marker");
  const p1Counter = doc.querySelector("#p1-counter");
  const p2Name = doc.querySelector("#p2-name");
  const p2Marker = doc.querySelector("#p2-marker");
  const p2Counter = doc.querySelector("#p2-counter");

  const start = doc.querySelector("#start-btn");
  const nextWrapper = doc.querySelector(".btn-group");
  const next = doc.querySelector("#next-btn");

  const bindEvents = () => {
    container.addEventListener("click", cellClicked);
    start.addEventListener("click", startGame);
    next.addEventListener("click", nextRound);
  };
  const startGame = () => {
    const player1Name = boxP1.value || "Player 1";
    const player2Name = boxP2.value || "Player 2";
    game.getPlayer(0).setName(player1Name);
    game.getPlayer(1).setName(player2Name);

    gameContainer.classList.remove("hidden");
    inputContainer.classList.add("hidden");
    inputContainer.classList.remove("flex-col");
    setPlayerCards();
    updateScreen();
  };

  const nextRound = () => {
    if (game.isRoundFinished()) {
      game.newRound();
      updateScreen();
    } else {
      console.log("The round is still active...");
    }
  };

  const restartRound = () => {
    game.newRound();
    updateScreen();
  };

  const cellClicked = (event) => {
    if (event.target.tagName === "BUTTON") {
      const prevIsFinished = game.isRoundFinished();
      const roundState = game.playTurn(event.target.id);
      updateScreen(roundState, prevIsFinished);
    }
  };

  const setPlayerCards = () => {
    const player1 = game.getPlayer(0);
    const player2 = game.getPlayer(1);
    p1Name.textContent = player1.getName();
    p2Name.textContent = player2.getName();
    p1Marker.textContent = player1.getMarker();
    p2Marker.textContent = player2.getMarker();
  };

  const updateScreen = (playStatus, prevIsFinished) => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // if round has ended don't re render
    if (game.isRoundFinished() && prevIsFinished) {
      return;
    }

    p1Counter.textContent = game.getWins(0);
    p2Counter.textContent = game.getWins(1);

    if (activePlayer === game.getPlayer(0)) {
      p1Marker.classList.add("p1-marker-active");
      p1Marker.classList.remove("p1-marker-inactive");
      p2Marker.classList.add("p2-marker-inactive");
      p2Marker.classList.remove("p2-marker-active");
    } else {
      p1Marker.classList.add("p1-marker-inactive");
      p1Marker.classList.remove("p1-marker-active");
      p2Marker.classList.add("p2-marker-active");
      p2Marker.classList.remove("p2-marker-inactive");
    }

    nextWrapper.classList.add("hidden");

    if (game.getRoundState() === "win") {
      msgBox.classList.remove("hidden");
      nextWrapper.classList.remove("hidden");
      msgBox.textContent = activePlayer.getName() + " wins!";
    } else if (game.getRoundState() === "draw") {
      msgBox.classList.remove("hidden");
      nextWrapper.classList.remove("hidden");
      msgBox.textContent = "It's a draw!";
    } else {
      msgBox.classList.add("hidden");
      msgBox.textContent = activePlayer.getName() + " turn";
    }

    // remove past state of the board
    container.textContent = "";

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellBtn = doc.createElement("button");
        cellBtn.id = i * game.getBoardSize() + j; // assign id number to cell
        if (!cell.isFree()) {
          if (cell.getValue() === "X") {
            cellBtn.classList.add("primary");
          } else {
            cellBtn.classList.add("secondary");
          }
          cellBtn.textContent = cell.getValue();
        }

        // painting winning cells
        if (playStatus && playStatus.win) {
          if (
            (playStatus.winType === "row" && playStatus.index === i) ||
            (playStatus.winType === "col" && playStatus.index === j) ||
            (playStatus.winType === "diag" && i === j) ||
            (playStatus.winType === "secondDiag" &&
              i + j === game.getBoardSize() - 1)
          ) {
            cellBtn.classList.add("highlighted-cell");
          }
        }
        cellBtn.classList.add("btn-cell");
        container.appendChild(cellBtn);
      });
    });
  };
  // startGame();
  bindEvents();
})(document);

// player 1 wins diag
// gameController.playTurn(4);
// gameController.playTurn(1);
// gameController.playTurn(2);
// gameController.playTurn(0);
// gameController.playTurn(6);

// gameController.newRound();

// player 2 wins col
// check this game state win isn't correctly recognized
// gameController.playTurn(8);
// gameController.playTurn(0);
// gameController.playTurn(2);
// gameController.playTurn(3);
// gameController.playTurn(1);
// gameController.playTurn(6);
// player 1 wins row
// gameController.newRound();
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
