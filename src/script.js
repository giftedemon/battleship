const Player = require("./modules/Player");
const player1Ships = require("./const");
const player2Ships = require("./const");

const player1Gameboard = document.querySelector(".player1__gameboard");
const player2Gameboard = document.querySelector(".player2__gameboard");
const mainGame = document.querySelector(".game");
const popUp = document.querySelector(".pop-up");
const p = popUp.querySelector("p");
const button = popUp.querySelector("button");
const variants = document.querySelectorAll(".img-variants");
const startGameButton = document.querySelector(".choice__button");
const playersChoice = document.querySelector(".players-choice");

const ship = document.querySelector(".ship");
let direction = "r";

let player1, player2;
let player1_type = "player";
let player2_type = "cpu";

let attackingPlayer = player1;
let receivingPlayer = player2;
let receivingPlayerGameboard = player2Gameboard;
let gameEnded = false;

variants.forEach((variant) => {
    variant.addEventListener("click", (e) => {
        const otherVariant = e.target.classList.contains("cpu")
            ? e.target.parentNode.querySelector(".person")
            : e.target.parentNode.querySelector(".cpu");

        e.target.classList.toggle("chosen");
        otherVariant.classList.toggle("chosen");

        const playerNumber = Number(e.target.parentNode.id);
        if (playerNumber === 1) {
            player1_type = e.target.id;
        } else {
            player2_type = e.target.id;
        }
    });
});

startGameButton.addEventListener("click", () => startGame());

ship.addEventListener("dragstart", (e) => {
    const length = Number(ship.id);
    player1Gameboard.addEventListener("dragover", (e) => {
        e.preventDefault();
        const { firstC, secondC } = player1.gameboard.getCoords(e.target.id);
        for (let i = 0; i < length; i++) {
            if (direction === "r") {
                if (secondC + i < 10) {
                    player1Gameboard.querySelector(
                        `.c${String(firstC)}m${String(secondC + i)}`
                    ).style["background-color"] = player1.gameboard.draggingShip(
                        e.target.id,
                        "r",
                        length
                    );
                }
            }
        }
    });

    player1Gameboard.addEventListener("dragleave", (e) => revertColor(e));

    player1Gameboard.addEventListener("drop", (e) => {
        const check = player1.gameboard.placeShip(e.target.id, direction, Number(ship.id));
        console.log(check);
        if (check === "Success") {
            renderShips();
        } else {
            revertColor(e);
        }
    });
});

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

function revertColor(e) {
    e.preventDefault();
    const { firstC, secondC } = player1.gameboard.getCoords(e.target.id);
    const length = Number(ship.id);
    for (let i = 0; i < length; i++) {
        if (direction === "r") {
            if (secondC + i < 10) {
                const div = player1Gameboard.querySelector(
                    `.c${String(firstC)}m${String(secondC + i)}`
                );
                if (div.textContent === "") {
                    div.style["background-color"] = "";
                } else if (div.textContent === "s") {
                    div.style["background-color"] = "green";
                }
            }
        }
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
            if (cell1 !== "." && cell1 !== "o") {
                cell1 = "s";
            } else {
                cell1 = "";
            }

            if (cell2 !== "." && cell2 !== "o") {
                cell2 = "s";
            } else {
                cell2 = "";
            }

            newDiv1.innerHTML += `<div class="cell c${i}m${j}" id="${i}m${j}" style="${
                cell1 === "s" ? "background-color: green" : ""
            }">${cell1}</div>`;
            newDiv2.innerHTML += `<div class="cell c${i}m${j}" id="${i}m${j}">${cell2}</div>`;
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

        const d = receivingPlayerGameboard.querySelector(`.c${firstC}m${secondC}`);

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
    player1 = new Player(player1_type);
    player2 = new Player(player2_type);

    player1.gameboard.reset();
    player2.gameboard.reset();

    player1.reset();
    player2.reset();

    receivingPlayer = player2;
    receivingPlayerGameboard = player2Gameboard;
    attackingPlayer = player1;

    placeShips();
    renderShips();

    playersChoice.classList.add("hidden");
    mainGame.classList.remove("hidden");
    mainGame.classList.remove("blurry");
    popUp.classList.add("hidden");

    gameEnded = false;

    if (attackingPlayer.type === "cpu") cpuAttack();
}

function cpuAttack() {
    setTimeout(() => makeATurn({ player: receivingPlayer }), 500);
}
