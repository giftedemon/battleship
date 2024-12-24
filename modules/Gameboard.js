import Ship from "./Ship";

class Gameboard {
    constructor() {
        this.board = {
            1: new Array(10).fill("."),
            2: new Array(10).fill("."),
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        };

        this.ships = 0;
    }

    placeShip(coordinate, direction, length) {
        const { firstC, secondC } = this.getCoords(coordinate);
        if (!this.checkValidCoords(firstC, secondC)) throw Error("Invalid coords");
        if (!this.checkValidDirection(direction)) throw Error("Invalid direction");
        if (!this.checkValidFit(firstC, secondC, direction, length)) throw Error("Invalid fit");

        const s = new Ship(length);
        if (direction === "r") {
            for (let i = secondC; i < length + secondC; i++) {
                if (this.board[firstC][i] !== ".") throw Error("Invalid placement");
                this.board[firstC][i] = s;
            }
        } else {
            for (let i = firstC; i < length + firstC; i++) {
                if (this.board[i][secondC] !== ".") throw Error("Invalid placement");
                this.board[i][secondC] = s;
            }
        }

        this.ships += 1;
    }

    receiveAttack(coordinate) {
        const { firstC, secondC } = this.getCoords(coordinate);
        if (!this.checkValidCoords(firstC, secondC)) throw Error("Invalid coords");

        if (this.board[firstC][secondC] !== ".") {
            this.board[firstC][secondC].hit();

            if (this.board[firstC][secondC].isSunk()) {
                this.ships -= 1;
            }

            this.board[firstC][secondC] = "X";

            if (this.checkShipsSunk()) {
                return true;
            }
        } else {
            this.board[firstC][secondC] = "O";
        }
    }

    checkValidFit(firstC, secondC, direction, length) {
        if (direction === "r") {
            if (secondC - 1 + length > 9) {
                return false;
            }
        } else if (direction === "d") {
            if (firstC - 1 + length > 10) {
                return false;
            }
        }
        return true;
    }

    checkValidPlacement(firstC, secondC, direction, length) {}

    getCoords(coordinate) {
        const firstC = Number(coordinate[0]);
        const secondC = coordinate[1].charCodeAt(0) - "A".charCodeAt(0);
        return { firstC, secondC };
    }

    checkValidCoords(firstC, secondC) {
        if (firstC < 1 || firstC > 10 || secondC < 0 || secondC > 9) {
            return false;
        }
        return true;
    }

    checkValidDirection(direction) {
        if (direction === "r" || direction === "d") {
            return true;
        }
        return false;
    }

    checkShipsSunk() {
        if (this.ships === 0) return true;
        return false;
    }

    // fillInvalidCoords(firstC, secondC )
}

module.exports = Gameboard;
