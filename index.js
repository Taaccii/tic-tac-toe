function Cell() {
  let value = 0;

  const getValue = () => value;

  const addSign = (player) => {
    value = player; 
  };

  return {
    addSign,
    getValue,
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

   if (cell.getValue() !== 0) return;

   cell.addSign(player);

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

  return {
    placeSign,
    getBoard,
    checkWinner,
    checkTie,
  };

})();


const createPlayer = (name, sign) => {
  return {name, sign};
}

const GameController = (() => {
  const players = [
    createPlayer("Mario", "X"),
    createPlayer("Luigi", "O"),
  ];
  
  let activePlayer = players[0];

  const switchTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    Gameboard.placeSign(row, column, activePlayer.sign);

    DisplayController.renderBoard();

    const winner = Gameboard.checkWinner();
    if (winner !== null) {
      DisplayController.showResult(`${activePlayer.name} ha vinto!`);
      return;
    }

    if (Gameboard.checkTie()) {
      DisplayController.showResult("Pareggio!");
      return;
    }

    switchTurn();
    DisplayController.updateTurnMessage();
  };

  return {
    getActivePlayer,
    playRound,
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
          const row = parseInt(cellDiv.dataset.rowIndex);
          const column = parseInt(cellDiv.dataset.colIndex);
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