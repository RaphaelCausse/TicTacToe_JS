// Handle players turn
let playerHu = 'X';     // Default player is X
const playerAI = 'O'    // Default AI player is O
let gameMode = 2;       // Default game mode is two players
let scoreX = 0, scoreO = 0;
let runningGame = 1;
let dimension = 3;
const boardSizeValue = 480;
let cellSizeValue = boardSizeValue/dimension;
let gameBoard = Array.from(Array(9).keys());
let winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],   
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Landing screen animation
const landing = document.getElementById('landing');
landing.classList.toggle('animUp');
// Turn indicator
const divTurnX = document.getElementById('turn-x');
const divTurnO = document.getElementById('turn-o');
// Score indicator
const divScoreX = document.getElementById('count-x');
const divScoreO = document.getElementById('count-o');
// Handle clicks and main game loop
let allCells = document.querySelectorAll('.cell');
allCells.forEach(cell => {
    cell.addEventListener('click', handleCellClick, {once: true});
});
// Handle game mode
const onePlayerButton = document.getElementById('one-player');
onePlayerButton.addEventListener('click', () => {
    setGameMode(onePlayerButton);
    if (!onePlayerButton.hasAttribute('clicked'))
        onePlayerButton.classList.add('clicked');
    twoPlayerButton.classList.remove('clicked');
});
const twoPlayerButton = document.getElementById('two-player');
twoPlayerButton.addEventListener('click', () => {
    setGameMode(twoPlayerButton);
    if (!twoPlayerButton.hasAttribute('clicked'))
        twoPlayerButton.classList.add('clicked');
    onePlayerButton.classList.remove('clicked');
});
// Handle resizable game board
const origBoard = document.getElementById('game-board');
const rangeSlider = document.getElementById('range');
rangeSlider.addEventListener('change', () => {
    dimension = getRangeValue();
    cellSizeValue = boardSizeValue/dimension;
    updateRangeValue(dimension);
    updateBoardCells(dimension)
    rebuildGameBoard(dimension);
    rebuildWinningCombos(dimension);
});
// End game popup
const endgamePopUp = document.getElementById('endgame-popup');
const endgameMessage = document.getElementById('win-text');
// Handle restart game
const restartButtons = document.querySelectorAll('[data-restart]');
restartButtons.forEach(btn => {
    btn.addEventListener('click', startGame);
});


function startGame() {
    endgamePopUp.style.top = '-100%';
    playerHu = 'X';
    // Reset turn indiactor
    divTurnX.removeAttribute('class');
    divTurnX.classList.add('bg-black', 'turn-indicator');
    divTurnO.removeAttribute('class');
    divTurnO.classList.add('bg-white', 'turn-indicator');
    // Reset game board
    runningGame = 1;
    rebuildGameBoard();
    allCells.forEach(cell => {
        if (cell.firstChild)
            cell.removeChild(cell.firstChild);
        cell.addEventListener('click', handleCellClick, {once: true});
        cell.style.backgroundColor = '#fff';
    });
}

function handleCellClick(cell) {
    if (gameMode === 2) {
        placeSymbol(playerHu, cell.target.id, cellSizeValue*0.8);
        checkWinOrDraw(playerHu);
        if (!runningGame) return;
        swapTurns(playerHu);
        playerHu = (playerHu === 'X') ? 'O' : 'X';
        return;
    }
    if (gameBoard[cell.target.id] !== 'O') {
        placeSymbol(playerHu, cell.target.id, cellSizeValue*0.8);
        checkWinOrDraw(playerHu);
        if (!runningGame) return;
        placeSymbol(playerAI, playAI(), cellSizeValue*0.8);
        checkWinOrDraw(playerAI);
        if (!runningGame) return;
    }         
}

function placeSymbol(player, cellId, imgSize) {
    let symbol = document.createElement('img');
    symbol.setAttribute('style', `width: ${imgSize}px; height: ${imgSize}px;`);
    switch(player) {
    case 'X':
        symbol.setAttribute("src", "img/cross.png");
        symbol.setAttribute("alt", "cross");
        break;
    case 'O':
        symbol.setAttribute("src", "img/circle.png");
        symbol.setAttribute("alt", "circle");
        break;
    default: break;
    }
    document.getElementById(cellId).appendChild(symbol);
    gameBoard[cellId] = player;
}

function playAI() {
    let avails = emptyCells(gameBoard);
    if (avails.length === 0) return;
    let randCellId = avails[Math.floor(Math.random() * avails.length)];
    allCells[randCellId].removeEventListener('click', handleCellClick, {once: true});
    return randCellId;
}

function emptyCells(board) {
    return board.filter(cell => typeof cell == 'number');
}

function checkWinOrDraw(player) {
    let check = false;
    winningCombos.forEach(combo => {
        if (combo.every(index => gameBoard[index] == player) && runningGame) {
            combo.every(index => allCells[index].style.backgroundColor = '#3aff85');
            winGameState(player);
            check = true;
        }
    });
    if (!check && emptyCells(gameBoard).length === 0) drawGameState();
}

function winGameState(player) {
    allCells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick, {once: true});
    });
    endgameMessage.textContent = 'Player ' + player + ' wins !';
    endgamePopUp.style.top = '0';
    (player === 'X') ? scoreX++ : scoreO++;
    divScoreX.textContent = scoreX;
    divScoreO.textContent = scoreO;
    runningGame = 0;
}

function drawGameState() {
    allCells.forEach(cell => {
        cell.removeEventListener('click', handleCellClick, {once: true});
    });
    endgameMessage.textContent = 'Draw !'
    endgamePopUp.style.top = '0';
    runningGame = 0;
}

function swapTurns(player) {
    switch (player) {
    case 'X': // Swap to O
        divTurnO.classList.replace('bg-white', 'bg-black');
        divTurnX.classList.replace('bg-black', 'bg-white');
        break;
    case 'O': // Swap to X
        divTurnO.classList.replace('bg-black', 'bg-white');
        divTurnX.classList.replace('bg-white', 'bg-black');
        break;
    default: break;
    }
}

function setGameMode(btn) {
    startGame();
    gameMode = (btn.id === 'one-player') ? 1 : 2;
    resetScores()
}

function resetScores() {
    scoreO = 0;
    divScoreO.textContent = scoreO;
    scoreX = 0;
    divScoreX.textContent = scoreX;
}

function getRangeValue() {
    return rangeSlider.value;
}

function updateRangeValue(value) {
    document.getElementById('range-value').textContent = 'Size: '+value+' x '+value;
    resetScores();
}

function updateBoardCells(value) {
    let cellSizeValue = 480/value;
    // Recreate cells of origBoard
    origBoard.innerHTML = "";
    for (let i = 0; i < value*value; i++) {
        let cell = document.createElement('div');
        cell.setAttribute('id', i);
        cell.setAttribute('class', 'cell');
        cell.setAttribute('style', `width: ${cellSizeValue}px; height: ${cellSizeValue}px;`);
        origBoard.appendChild(cell);
    }
    origBoard.setAttribute('style', `grid-template-columns: repeat(${value}, auto);`);
    // Reassign them an event listener
    allCells = document.querySelectorAll('.cell');
    allCells.forEach(cell => {
        cell.addEventListener('click', handleCellClick, {once: true});
    });
}

function rebuildGameBoard() {
    gameBoard = Array.from(Array(dimension*dimension).keys());
}

function rebuildWinningCombos(dimension) {
    let arr = [];
    winningCombos = [];
    // Rows
    for (let a = 0; a < dimension; a++) {
        for (let k = 0; k < dimension; k++)
            arr.push(Number(dimension * a + k));
        winningCombos.push(arr);
        arr = [];
    }
    // Columns
    for (let b = 0; b < dimension; b++) {
        for (let k = 0; k < dimension; k++)
            arr.push(Number(dimension*k + b));
        winningCombos.push(arr);
        arr = [];
    }
    // Top left diagonal
    for (let c = 0; c < dimension; c++)
        arr.push(Number(dimension*c + c));
    winningCombos.push(arr);
    arr = [];
    // Top right diagonal
    for (let d = 0; d < dimension; d++)
        arr.push(Number((dimension-1)*d + (dimension-1)));
    winningCombos.push(arr);
}