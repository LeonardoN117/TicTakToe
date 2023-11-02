const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

initializeGame();

function initializeGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);

    // Load the game state from local storage
    loadGameState();

    // Check if the game was running when the browser was closed
    if (running) {
        statusText.textContent = `${currentPlayer}'s turn`;
    } else {
        statusText.textContent = "Game Over";
    }
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    // Save the game state after each move
    saveGameState();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        // Save the game state when the game ends
        saveGameState();
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
        // Save the game state when the game ends
        saveGameState();
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
    
    // Save the game state when restarting the game
    saveGameState();
}

function saveGameState() {
    const gameState = {
        options,
        currentPlayer,
        running
    };

    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
}

function loadGameState() {
    const savedGameState = localStorage.getItem("ticTacToeGame");
    if (savedGameState) {
        const gameState = JSON.parse(savedGameState);
        options = gameState.options;
        currentPlayer = gameState.currentPlayer;
        running = gameState.running;

        cells.forEach((cell, index) => {
            cell.textContent = options[index];
        });
    }
}
