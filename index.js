function Cell() {
  let value = 0;

  const getValue = () => value;

  const addSign = (player) => {
    value = player; 
  };

  const reset = () => value = 0;

  return {
    addSign,
    getValue,
    reset,
  };
}


const Gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];


  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const placeSign = (row, column, player) => {

    const cell = board[row][column];

    if (cell.getValue() !== 0) return false;

    cell.addSign(player);
    return true;

  };



  const checkWinner = () => {
   const winningCombinations = [
    // rows
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // columns
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // diagonals
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]],
    ];

    for (const combination of winningCombinations) {
      const [r, c] = combination[0];
      const firstValue = board[r][c].getValue();

      if (firstValue === 0) continue;

      const hasWinner = combination.every(([r, c]) =>
        board[r][c].getValue() === firstValue
      );

      if (hasWinner) return firstValue;
    }
    return null;
  }

  const checkTie = () => {
    return board.every((row) =>
    row.every((cell) => cell.getValue() !== 0)
    );
  };

  const resetBoard = () => {
    board.forEach(row => row.forEach(cell => cell.reset()));
  }

  return {
    placeSign,
    getBoard,
    checkWinner,
    checkTie,
    resetBoard,
  };

})();


const createPlayer = (name, sign) => {
  return {name, sign};
}

const GameController = (() => {
  const players = [
    createPlayer("", "X"),
    createPlayer("", "O"),
  ];

  let gameActive = false;
  let activePlayer = players[0];
  
  const startGame = (nameOne, nameTwo) => {
    players[0] = createPlayer(nameOne, "X");
    players[1] = createPlayer(nameTwo, "O");
    activePlayer = players[0];
    gameActive = true;
  }

  const resetGame = () => {
    Gameboard.resetBoard();
    gameActive = false;
    activePlayer = players[0];
  }

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    if (!gameActive) return;
    
    const movePlaced = Gameboard.placeSign(row, column, activePlayer.sign);
    if (!movePlaced) return;

    DisplayController.renderBoard();

    const winner = Gameboard.checkWinner();
    if (winner !== null) {
      gameActive = false;
      DisplayController.showResult(`${activePlayer.name} ha vinto!`);
      return;
    }

    if (Gameboard.checkTie()) {
      gameActive = false;
      DisplayController.showResult("Pareggio!");
      return;
    }

    switchTurn();
    DisplayController.updateTurnMessage();
  };

  return {
    getActivePlayer,
    playRound,
    startGame,
    resetGame,
  };

})();


const DisplayController = (() => {
  const boardDiv = document.getElementById("game-board");
  const turnMessageDiv = document.getElementById("turn-message");
  const resultMessageDiv = document.getElementById("result-message");

  const renderBoard = () => {
    boardDiv.innerHTML = "";
    const board = Gameboard.getBoard();

    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.textContent = cell.getValue() === 0 ? "" : cell.getValue();
        cellDiv.dataset.row = rowIndex;
        cellDiv.dataset.column = colIndex;

        cellDiv.addEventListener("click", () => {
          const row = parseInt(cellDiv.dataset.row);
          const column = parseInt(cellDiv.dataset.column);
          GameController.playRound(row, column);
        });
        
        boardDiv.appendChild(cellDiv);
      });
    });
  };

  const updateTurnMessage = () => {
  const activePlayer = GameController.getActivePlayer();
  turnMessageDiv.textContent = `È il turno di ${activePlayer.name}`;
  };

  const showResult = (message) => {
    resultMessageDiv.textContent = message;
  };

  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", () => {
    const nameOne = document.getElementById("player-one").value;
    const nameTwo = document.getElementById("player-two").value;

    if (nameOne === "" || nameTwo === "") {
      alert ("You need to choose players names to play the game!");
      return;
    }

    GameController.startGame(nameOne, nameTwo);
    renderBoard();
    updateTurnMessage();

  });

  const resetBtn = document.getElementById("reset-btn");

  resetBtn.addEventListener("click", () => {
    GameController.resetGame();
    resultMessageDiv.textContent = "";
    renderBoard();
    updateTurnMessage();
  });

  return {
    renderBoard,
    updateTurnMessage,
    showResult,
  };

})();


const init = () => {
  DisplayController.renderBoard();
  DisplayController.updateTurnMessage();
};

init();