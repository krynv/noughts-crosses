let originalBoard;
let humanPlayer = 'O';
let aiPlayer = 'X';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [6, 4, 2],
    [2, 5, 8],
    [1, 4, 7],
    [0, 3, 6]
];

const cells = document.querySelectorAll('.cell');

const selectSymbol = symbol => {
    humanPlayer = symbol;
    aiPlayer = symbol === 'O' ? 'X' : 'O';
    originalBoard = Array.from(Array(9).keys());

    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }

    if (aiPlayer === 'X') {
        turn(bestSpot(), aiPlayer);
    }

    document.querySelector('.selectSymbol').style.display = 'none';
};

const startGame = () => {
    document.querySelector('.endgame').style.display = 'none';
    document.querySelector('.endgame .text').innerText = '';
    document.querySelector('.selectSymbol').style.display = 'block';

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
    }
};

const turnClick = square => {
    if (typeof originalBoard[square.target.id] === 'number') {
        turn(square.target.id, humanPlayer);

        if (!checkWin(originalBoard, humanPlayer) && !checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
};

const turn = (squareId, player) => {
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;

    const gameWon = checkWin(originalBoard, player);

    if (gameWon) {
        gameOver(gameWon);
    }
    checkTie();
};

const checkWin = (board, player) => {
    const plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winningCombinations.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = { index, player };
            break;
        }
    }
    return gameWon;
};

const gameOver = gameWon => {
    for (let index of winningCombinations[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? 'blue' : 'red';
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player === humanPlayer ? 'You win!' : 'You lose');
};

const declareWinner = who => {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
};
const emptySquares = () => originalBoard.filter((elm, i) => i === elm);

const bestSpot = () => minimax(originalBoard, aiPlayer).index;

const checkTie = () => {
    if (emptySquares().length === 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }

        declareWinner('Tie game');
        return true;
    }
    return false;
};

const minimax = (newBoard, player) => {
    const availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        move.score = player === aiPlayer ? minimax(newBoard, humanPlayer).score : minimax(newBoard, aiPlayer).score;
        newBoard[availSpots[i]] = move.index;

        if ((player === aiPlayer && move.score === 10) || (player === humanPlayer && move.score === -10)) {
            return move;
        } else {
            moves.push(move);
        }

    }

    let bestMove, bestScore;
    if (player === aiPlayer) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

startGame();