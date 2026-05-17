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

  const placeSign = (column, row, player) => {

   const cell = board[row][column];

   if (cell.getValue() !== 0) return;

   cell.addSign(player);

  };

  return {
    placeSign,
    getBoard,
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

  const swithTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const getActivePlayer = () => activePlayer;

  return { getActivePlayer };
})();