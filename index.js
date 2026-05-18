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

    const winner = Gameboard.checkWinner();

    if (winner !== null) {
      console.log(`${activePlayer.name} ha vinto!`);
      return;
    }

    if (Gameboard.checkTie()) {
      console.log("Pareggio!");
      return;
    }

    switchTurn();
  };

  return {
    getActivePlayer,
    playRound,
  };

})();

