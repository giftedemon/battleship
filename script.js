import Player from "./modules/Player.js";
import shipsCoords from "./const.js";

const player1Gameboard = document.querySelector(".player1__gameboard");
const player2Gameboard = document.querySelector(".player2__gameboard");
const mainGame = document.querySelector(".game");
const popUp = document.querySelector(".pop-up");
const p = popUp.querySelector("p");
const button = popUp.querySelector("button");
const variants = document.querySelectorAll(".img-variants");
const startGameButton = document.querySelector(".choice__button");
const playersChoice = document.querySelector(".players-choice");
const beginGameButton = document.querySelector(".game__begin");
const allReadyP = document.querySelectorAll(".ready");

const ships1 = document.querySelectorAll(".ship");
const shipsList1 = document.querySelector(".ships");
const ships2 = document.querySelectorAll(".ship2");
const shipsList2 = document.querySelector(".ships2");
const resetButtons = document.querySelectorAll(".reset");
const flipButtons = document.querySelectorAll(".flip");
const randomizeButtons = document.querySelectorAll(".random");
const showHideButtons = document.querySelectorAll(".show-hide");
const allButtons = document.querySelectorAll(".game__button");

let placedShip = false;
const directions = ["r", "r"];
const showHideList = [false, false];

let player1, player2;
let player1_type = "player";
let player2_type = "cpu";

let attackingPlayer = player1;
let receivingPlayer = player2;
let receivingPlayerGameboard = player2Gameboard;
let beginGame = false;
let gameEnded = false;

variants.forEach((variant) => {
    variant.addEventListener("click", (e) => {
        let otherVariant, variantText;
        if (e.target.classList.contains("cpu")) {
            otherVariant = e.target.parentNode.querySelector(".person");
            variantText = "CPU";
        } else {
            otherVariant = e.target.parentNode.querySelector(".cpu");
            variantText = "Player";
        }

        e.target.classList.add("chosen");
        otherVariant.classList.remove("chosen");

        e.target.parentNode.parentNode.querySelector(".player__title").textContent = variantText;

        const playerNumber = Number(e.target.parentNode.id);
        if (playerNumber === 1) {
            player1_type = e.target.id;
        } else {
            player2_type = e.target.id;
        }
    });
});

startGameButton.addEventListener("click", () => startGame());

randomizeButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
        const playerNumber = Number(e.target.id);
        let player, mainShipsList, playerGameboard;

        if (playerNumber === 1) {
            player = player1;
            playerGameboard = player1Gameboard;
            mainShipsList = shipsList1;
        } else {
            player = player2;
            playerGameboard = player2Gameboard;
            mainShipsList = shipsList2;
        }

        const p = e.target.parentNode.parentNode.querySelector("p");
        p.textContent = "Ready";

        mainShipsList.classList.add("hidden");

        player.gameboard.reset();
        placeShips(player);
        renderShips(player, playerGameboard, playerNumber);

        if (showHideButtons[playerNumber - 1].classList.contains("hidden")) {
            showHideButtons[playerNumber - 1].classList.remove("hidden");
        }
    });
});

resetButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
        const playerNumber = Number(e.target.id);
        let player, mainShips, mainShipsList, playerGameboard;

        if (playerNumber === 1) {
            player = player1;
            mainShips = ships1;
            mainShipsList = shipsList1;
            playerGameboard = player1Gameboard;
        } else {
            player = player2;
            mainShips = ships2;
            mainShipsList = shipsList2;
            playerGameboard = player2Gameboard;
        }

        const p = e.target.parentNode.parentNode.querySelector("p");
        p.textContent = "Not ready";

        player.gameboard.reset();
        renderShips(player, playerGameboard, playerNumber);

        showHideButtons[playerNumber - 1].classList.add("hidden");
        showHideButtons[playerNumber - 1].textContent = "Hide";
        showHideList[playerNumber - 1] = "true";

        mainShipsList.classList.remove("hidden");
        mainShips.forEach((el) => {
            el.classList.remove("hidden");
        });
    });
});

flipButtons.forEach((flip) => {
    flip.addEventListener("click", (e) => {
        const playerNumber = Number(e.target.id);

        directions[playerNumber - 1] = directions[playerNumber - 1] === "r" ? "d" : "r";

        let shipCSS;

        if (playerNumber === 1) shipCSS = ships1;
        if (playerNumber === 2) shipCSS = ships2;

        shipCSS.forEach((ship) => {
            ship.style["flex-direction"] =
                ship.style["flex-direction"] === "column" ? "row" : "column";
        });
    });
});

showHideButtons.forEach((el) => {
    el.addEventListener("click", (e) => {
        const playerNumber = Number(e.target.id);
        let player, playerGameboard;

        if (playerNumber === 1) {
            player = player1;
            playerGameboard = player1Gameboard;
        } else {
            player = player2;
            playerGameboard = player2Gameboard;
        }

        if (e.target.textContent === "Show") {
            showHide(true, playerGameboard);
            e.target.textContent = "Hide";
            showHideList[playerNumber - 1] = true;
        } else {
            showHide(false, playerGameboard);
            e.target.textContent = "Show";
            showHideList[playerNumber - 1] = false;
        }
    });
});

[ships1, ships2].forEach((ships) => {
    ships.forEach((ship) => {
        ship.addEventListener("dragstart", (e) => {
            const transparentImg = new Image();
            transparentImg.src = "";
            e.dataTransfer.setDragImage(transparentImg, 0, 0);

            ship.classList.add("draggable");
        });

        ship.addEventListener("dragend", () => {
            ship.classList.remove("draggable");
            if (placedShip) {
                ship.classList.add("hidden");
                placedShip = false;

                let player;

                if (Number(ship.parentNode.id) === 1) player = player1;
                else player = player2;

                if (player.gameboard.ships === 10) {
                    const p = ship.parentNode.parentNode.querySelector("p");
                    p.textContent = "Ready";

                    showHideButtons[Number(ship.parentNode.id) - 1].classList.remove("hidden");
                }
            }
        });
    });
});

[player1Gameboard, player2Gameboard].forEach((playerGameboard) => {
    playerGameboard.addEventListener("dragover", (e) => {
        let player, playerNumber;
        if (playerGameboard === player1Gameboard) {
            player = player1;
            playerNumber = 1;
        } else {
            player = player2;
            playerNumber = 2;
        }

        e.preventDefault();
        const ship = document.querySelector(".draggable");
        if (Number(ship.parentNode.id) === playerNumber) {
            const length = Number(ship.id);
            const { firstC, secondC } = player.gameboard.getCoords(e.target.id);
            for (let i = 0; i < length; i++) {
                if (directions[playerNumber - 1] === "r" && secondC + i < 10) {
                    playerGameboard.querySelector(
                        `.c${String(firstC)}m${String(secondC + i)}`
                    ).style["background-color"] = player.gameboard.draggingShip(
                        e.target.id,
                        "r",
                        length
                    );
                } else if (directions[playerNumber - 1] === "d" && firstC + i < 11) {
                    playerGameboard.querySelector(
                        `.c${String(firstC + i)}m${String(secondC)}`
                    ).style["background-color"] = player.gameboard.draggingShip(
                        e.target.id,
                        "d",
                        length
                    );
                }
            }
        }
    });

    playerGameboard.addEventListener("dragleave", (e) => {
        let player, playerNumber;
        if (playerGameboard === player1Gameboard) {
            player = player1;
            playerNumber = 1;
        } else {
            player = player2;
            playerNumber = 2;
        }

        const ship = document.querySelector(".draggable");
        const length = Number(ship.id);

        if (Number(ship.parentNode.id) === playerNumber) {
            revertColor(e, length, player, playerGameboard, directions[playerNumber - 1]);
        }
    });

    playerGameboard.addEventListener("drop", (e) => {
        let player, playerNumber;
        if (playerGameboard === player1Gameboard) {
            player = player1;
            playerNumber = 1;
        } else {
            player = player2;
            playerNumber = 2;
        }

        const ship = document.querySelector(".draggable");
        if (Number(ship.parentNode.id) === playerNumber) {
            const length = Number(ship.id);
            const check = player.gameboard.placeShip(
                e.target.id,
                directions[playerNumber - 1],
                Number(ship.id)
            );

            if (check === "Success") {
                placedShip = true;
                renderShips(player, playerGameboard, playerNumber);
            } else {
                revertColor(e, length, player, playerGameboard, directions[playerNumber - 1]);
            }
        }
    });
});

beginGameButton.addEventListener("click", () => {
    if (player1.gameboard.ships !== 10) {
        console.log("Player 1 is not ready");
        return;
    }

    if (player2.gameboard.ships !== 10) {
        console.log("Player 2 is not ready");
        return;
    }
    beginGame = true;
    allButtons.forEach((el) => el.classList.add("hidden"));
    beginGameButton.classList.add("hidden");

    if (attackingPlayer.type === "cpu") cpuAttack();
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

function revertColor(e, length, player, gameboard, direction) {
    e.preventDefault();
    const { firstC, secondC } = player.gameboard.getCoords(e.target.id);
    for (let i = 0; i < length; i++) {
        if (direction === "r" && secondC + i < 10) {
            const div = gameboard.querySelector(`.c${String(firstC)}m${String(secondC + i)}`);
            if (div.classList.contains("occupied")) {
                div.style["background-color"] = "green";
            } else {
                div.style["background-color"] = "";
            }
        } else if (direction === "d" && firstC + i < 11) {
            const div = gameboard.querySelector(`.c${String(firstC + i)}m${String(secondC)}`);
            if (div.classList.contains("occupied")) {
                div.style["background-color"] = "green";
            } else {
                div.style["background-color"] = "";
            }
        }
    }
}

function placeShips(player) {
    const randomCoords = shipsCoords[Math.floor(Math.random() * shipsCoords.length)];
    for (let i = 0; i < randomCoords.length; i++) {
        const { coordinate, direction, length } = randomCoords[i];
        player.gameboard.placeShip(coordinate, direction, length);
    }
}

function renderShips(player, playerGameboard, playerNumber) {
    playerGameboard.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        playerGameboard.innerHTML += `<div class="row${i} row"></div>`;
        ``;

        const newDiv = playerGameboard.querySelector(`.row${i}`);

        for (let j = 0; j < 10; j++) {
            let cell = player.gameboard.board[i][j];

            if (cell !== "." && cell !== "o") {
                cell = "s";
            } else {
                cell = "";
            }

            newDiv.innerHTML += `<div class="cell c${i}m${j} ${
                cell === "s" ? "occupied" : ""
            }" id="${i}m${j}" style=""></div>`;
        }
    }

    showHide(showHideList[playerNumber - 1], playerGameboard);
}

function showHide(show, playerGameboard) {
    const allOccupiedCells = playerGameboard.querySelectorAll(".occupied");

    if (show) {
        allOccupiedCells.forEach((el) => {
            el.style["background-color"] = "green";
        });
    } else {
        allOccupiedCells.forEach((el) => {
            el.style["background-color"] = "";
        });
    }
}

function makeATurn({ e, player }) {
    if (!beginGame || gameEnded || player === attackingPlayer) return;

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

    if (player1.type === "player") {
        showHideList[0] = true;
    }
    if (player2.type === "player") {
        showHideList[1] = true;
    }
    if (player1.type === "player" && player2.type === "player") {
        showHideList[0] = false;
        showHideList[1] = false;
    }

    showHideButtons.forEach((el, i) => {
        if (showHideList[i]) {
            el.textContent = "Hide";
        } else {
            el.textContent = "Show";
        }
    });

    placeShips(player1);
    placeShips(player2);
    renderShips(player1, player1Gameboard, 1);
    renderShips(player2, player2Gameboard, 2);

    shipsList1.classList.add("hidden");
    shipsList2.classList.add("hidden");

    allReadyP.forEach((p) => {
        p.textContent = "Ready";
    });

    beginGame = false;
    allButtons.forEach((el) => el.classList.remove("hidden"));
    beginGameButton.classList.remove("hidden");

    playersChoice.classList.add("hidden");
    mainGame.classList.remove("hidden");
    mainGame.classList.remove("blurry");
    popUp.classList.add("hidden");

    gameEnded = false;
}

function cpuAttack() {
    setTimeout(() => makeATurn({ player: receivingPlayer }), 500);
}
