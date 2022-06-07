let originalBoard;

const humanPlayer = 'X';
const aiPlayer = 'O';
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');

const turn = (id, player) => {
    originalBoard[id] = player;
    document.getElementById(id).innerText = player;
};

const turnClick = square => {
    turn(square.target.id, humanPlayer);
};

const startGame = () => {
    document.querySelector('.endgame').style.display = 'none';
    originalBoard = [...Array(10).keys()];

    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
};

startGame();
