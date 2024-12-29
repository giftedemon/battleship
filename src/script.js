const Player = require("./modules/Player");

const player1Ships = [
    { coordinate: "2B", direction: "d", length: 1 },
    { coordinate: "1E", direction: "d", length: 1 },
    { coordinate: "2G", direction: "r", length: 3 },
    { coordinate: "4A", direction: "r", length: 2 },
    { coordinate: "4E", direction: "d", length: 4 },
    { coordinate: "5I", direction: "d", length: 1 },
    { coordinate: "8H", direction: "r", length: 1 },
    { coordinate: "9B", direction: "d", length: 2 },
    { coordinate: "9D", direction: "r", length: 3 },
    { coordinate: "10H", direction: "r", length: 2 },
];

const player2Ships = [
    { coordinate: "2B", direction: "d", length: 1 },
    { coordinate: "1E", direction: "d", length: 1 },
    { coordinate: "2G", direction: "r", length: 3 },
    { coordinate: "4A", direction: "r", length: 2 },
    { coordinate: "4E", direction: "d", length: 4 },
    { coordinate: "5I", direction: "d", length: 1 },
    { coordinate: "8H", direction: "r", length: 1 },
    { coordinate: "9B", direction: "d", length: 2 },
    { coordinate: "9D", direction: "r", length: 3 },
    { coordinate: "10H", direction: "r", length: 2 },
];

const player1Gameboard = document.querySelector(".player1__gameboard");
const player2Gameboard = document.querySelector(".player2__gameboard");
const mainGame = document.querySelector(".game");
const popUp = document.querySelector(".pop-up");
const p = popUp.querySelector("p");
const button = popUp.querySelector("button");

const player1 = new Player("cpu", 1);
const player2 = new Player("cpu", 2);

let attackingPlayer = player1;
let receivingPlayer = player2;
let receivingPlayerGameboard = player2Gameboard;
let gameEnded = false;

startGame();

player1Gameboard.addEventListener("click", (e) => makeATurn({ e, player: player1 }));
player2Gameboard.addEventListener("click", (e) => makeATurn({ e, player: player2 }));

button.addEventListener("click", () => startGame());

function render(div, el) {
    div.innerHTML = el;
    if (el === "X") {
        div.style["background-color"] = "red";
    } else {
        div.style["background-color"] = "gray";
    }
}

function placeShips() {
    for (let i = 0; i < player1Ships.length; i++) {
        const { coordinate, direction, length } = player1Ships[i];
        player1.gameboard.placeShip(coordinate, direction, length);
        player2.gameboard.placeShip(coordinate, direction, length);
    }
}

function renderShips() {
    player1Gameboard.innerHTML = "";
    player2Gameboard.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        player1Gameboard.innerHTML += `<div class="row${i} row"></div>`;
        ``;
        player2Gameboard.innerHTML += `<div class="row${i} row"></div>`;
        ``;

        const newDiv1 = player1Gameboard.querySelector(`.row${i}`);
        const newDiv2 = player2Gameboard.querySelector(`.row${i}`);
        for (let j = 0; j < 10; j++) {
            let cell1 = player1.gameboard.board[i][j];
            let cell2 = player2.gameboard.board[i][j];
            if (cell1 !== ".") {
                cell1 = "s";
            } else {
                cell1 = "";
            }

            if (cell2 !== ".") {
                cell2 = "";
            } else {
                cell2 = "";
            }

            newDiv1.innerHTML += `<div class="cell c${i}${String.fromCharCode(
                65 + j
            )}" id="${i}${String.fromCharCode(65 + j)}">${cell1}</div>`;
            newDiv2.innerHTML += `<div class="cell c${i}${String.fromCharCode(
                65 + j
            )}" id="${i}${String.fromCharCode(65 + j)}">${cell2}</div>`;
        }
    }
}

function makeATurn({ e, player }) {
    if (gameEnded || player === attackingPlayer) return;

    if (player === receivingPlayer) {
        let cell;

        if (attackingPlayer.type === "cpu") {
            cell = attackingPlayer.attack();
        } else {
            cell = e.target.id;
        }

        const { changedCells, hit, end, validTurn, hitCell, sunk } = attackCell(cell);
        if (!validTurn) {
            return;
        }

        attackingPlayer.updateInfo({ hit, hitCell, sunk, cells: changedCells });
        renderCells(changedCells);

        if (!hit) {
            changePlayersOrder();
        }

        if (end) endGame();
        else if (attackingPlayer.type === "cpu") cpuAttack();
    }
}

function attackCell(cell) {
    const obj = receivingPlayer.gameboard.receiveAttack(cell);

    return obj;
}

function renderCells(changedCells) {
    for (let i of changedCells) {
        const [firstC, secondC] = i;

        const d = receivingPlayerGameboard.querySelector(
            `.c${firstC}${String.fromCharCode(65 + secondC)}`
        );

        render(d, receivingPlayer.gameboard.board[firstC][secondC]);
    }
}

function changePlayersOrder() {
    receivingPlayer = receivingPlayer === player1 ? player2 : player1;
    receivingPlayerGameboard =
        receivingPlayerGameboard === player1Gameboard ? player2Gameboard : player1Gameboard;

    attackingPlayer = attackingPlayer === player1 ? player2 : player1;
}

function endGame() {
    mainGame.classList.add("blurry");
    popUp.classList.remove("hidden");
    writeWinner();

    gameEnded = true;
}

function writeWinner() {
    p.innerHTML = `${receivingPlayer === player1 ? "Player 2" : "Player 1"} wins!`;
}

function startGame() {
    player1.gameboard.reset();
    player2.gameboard.reset();

    player1.reset();
    player2.reset();

    receivingPlayer = player2;
    receivingPlayerGameboard = player2Gameboard;
    attackingPlayer = player1;

    placeShips();
    renderShips();

    mainGame.classList.remove("blurry");
    popUp.classList.add("hidden");

    gameEnded = false;

    if (attackingPlayer.type === "cpu") cpuAttack();
}

function cpuAttack() {
    setTimeout(() => makeATurn({ player: receivingPlayer }), 500);
}
