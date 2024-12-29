const Ship = require("./Ship");

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
        this.shipCoords = {};
    }

    draggingShip(coordinate, direction, length) {
        const { firstC, secondC } = this.getCoords(coordinate);

        // Check if the placement of ship is valid
        if (!this.checkValidCoords(firstC, secondC)) return "red";
        if (!this.checkValidDirection(direction)) return "red";
        if (!this.checkValidFit(firstC, secondC, direction, length)) return "red";
        if (!this.checkValidPlacement(firstC, secondC, direction, length)) return "red";

        return "green";
    }

    placeShip(coordinate, direction, length) {
        const { firstC, secondC } = this.getCoords(coordinate);

        // Check if the placement of ship is valid
        if (!this.checkValidCoords(firstC, secondC)) return "Invalid coords";
        if (!this.checkValidDirection(direction)) return "Invalid direction";
        if (!this.checkValidFit(firstC, secondC, direction, length)) return "Invalid fit";
        if (!this.checkValidPlacement(firstC, secondC, direction, length))
            return "Invalid placement";

        const s = new Ship(length, this.ships);
        this.shipCoords[this.ships] = []; // Storing the coordinates of ships for marking surrounding cells
        if (direction === "r") {
            for (let i = secondC; i < length + secondC; i++) {
                this.board[firstC][i] = s;
                this.shipCoords[this.ships].push([firstC, i]);
                this.sinkXCoords(firstC, i, "o");
            }
        } else {
            for (let i = firstC; i < length + firstC; i++) {
                this.board[i][secondC] = s;
                this.shipCoords[this.ships].push([i, secondC]);
                this.sinkXCoords(i, secondC, "o");
            }
        }

        this.sinkLastCoords(this.shipCoords[s.id][0], "o");
        this.sinkLastCoords(this.shipCoords[s.id][this.shipCoords[s.id].length - 1], "o");

        this.ships += 1;
        return "Success";
    }

    receiveAttack(coordinate) {
        const { firstC, secondC } = this.getCoords(coordinate);
        let changedCells = [];
        let hit = false;
        let end = false;
        let validTurn = false;
        let sunk = false;
        let hitCell = null;
        if (!this.checkValidCoords(firstC, secondC))
            throw Error(`Invalid coords, ${firstC}${secondC}`);

        if (this.board[firstC][secondC] instanceof Ship) {
            validTurn = true;
            hit = true;
            const boat = this.board[firstC][secondC];
            hitCell = [firstC, secondC];

            this.board[firstC][secondC] = "X";

            boat.hit();
            changedCells = changedCells.concat(this.sinkXCoords(firstC, secondC)); // Marking X cells

            if (boat.isSunk()) {
                sunk = true;
                // Marking the rest cells
                changedCells = changedCells.concat(
                    this.sinkLastCoords(this.shipCoords[boat.id][0])
                );
                changedCells = changedCells.concat(
                    this.sinkLastCoords(
                        this.shipCoords[boat.id][this.shipCoords[boat.id].length - 1]
                    )
                );
                this.ships -= 1;
            }

            if (this.checkShipsSunk()) {
                // Game over
                end = true;
            }
        } else if (this.board[firstC][secondC] === "." || this.board[firstC][secondC] === "o") {
            validTurn = true;
            this.board[firstC][secondC] = "·";
        }
        changedCells.push([firstC, secondC]);

        return { changedCells, hit, end, validTurn, sunk, hitCell };
    }

    sinkXCoords(firstC, secondC, sym = "·") {
        const arr = [];
        if (firstC > 1) {
            if (secondC > 0) {
                this.board[firstC - 1][secondC - 1] = sym;
                arr.push([firstC - 1, secondC - 1]);
            }

            if (secondC < 9) {
                this.board[firstC - 1][secondC + 1] = sym;
                arr.push([firstC - 1, secondC + 1]);
            }
        }

        if (firstC < 10) {
            if (secondC > 0) {
                this.board[firstC + 1][secondC - 1] = sym;
                arr.push([firstC + 1, secondC - 1]);
            }

            if (secondC < 9) {
                this.board[firstC + 1][secondC + 1] = sym;
                arr.push([firstC + 1, secondC + 1]);
            }
        }

        return arr;
    }

    sinkLastCoords(arr, sym = "·") {
        const [firstC, secondC] = arr;
        const newArr = [];
        if (firstC > 1) {
            if (
                this.board[firstC - 1][secondC] === "." ||
                this.board[firstC - 1][secondC] === "o"
            ) {
                this.board[firstC - 1][secondC] = sym;
                newArr.push([firstC - 1, secondC]);
            }
        }

        if (firstC < 10) {
            if (
                this.board[firstC + 1][secondC] === "." ||
                this.board[firstC + 1][secondC] === "o"
            ) {
                this.board[firstC + 1][secondC] = sym;
                newArr.push([firstC + 1, secondC]);
            }
        }

        if (secondC > 0) {
            if (
                this.board[firstC][secondC - 1] === "." ||
                this.board[firstC][secondC - 1] === "o"
            ) {
                this.board[firstC][secondC - 1] = sym;
                newArr.push([firstC, secondC - 1]);
            }
        }

        if (secondC < 9) {
            if (
                this.board[firstC][secondC + 1] === "." ||
                this.board[firstC][secondC + 1] === "o"
            ) {
                this.board[firstC][secondC + 1] = sym;
                newArr.push([firstC, secondC + 1]);
            }
        }

        return newArr;
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

    checkValidPlacement(firstC, secondC, direction, length) {
        if (direction === "r") {
            for (let i = secondC; i < length + secondC; i++) {
                if (this.board[firstC][i] !== ".") return false; // If there is a ship already
            }
        } else {
            for (let i = firstC; i < length + firstC; i++) {
                if (this.board[i][secondC] !== ".") return false;
            }
        }

        return true;
    }

    getCoords(coordinate) {
        let [firstC, secondC] = coordinate.split("m");
        firstC = Number(firstC);
        secondC = Number(secondC);
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

    reset() {
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
        this.shipCoords = {};
    }

    // fillInvalidCoords(firstC, secondC )
}

module.exports = Gameboard;
