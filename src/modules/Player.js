import Gameboard from "./Gameboard.js";

export default class Player {
    constructor(type, n) {
        this.type = type;
        this.positions = Array.from({ length: 100 }, (_, i) => i + 10);
        this.potentialShip = [];
        this.potentialCell = null;
        this.potentialPlaces = [-10, 1, 10, -1];
        this.potentialPlaceIndex = 0;
        this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];

        this.gameboard = new Gameboard();
        this.n = n;
    }

    attack() {
        let p =
            this.potentialCell === null
                ? this.positions[Math.floor(Math.random() * this.positions.length)]
                : this.potentialCell;

        let firstEl, secondEl;

        if (p < 100) {
            firstEl = String(p)[0];
            secondEl = String(p)[1];
        } else {
            firstEl = `10`;
            secondEl = p - 100;
        }

        p = `${firstEl}m${secondEl}`;
        return p;
    }

    updateInfo({ hit, cells, hitCell, sunk }) {
        this.updateCells(cells);
        if (hit) {
            if (!sunk) {
                const [firstC, secondC] = hitCell;
                const p = 10 * firstC + secondC;

                if (this.potentialShip.length === 0) {
                    this.potentialShip.push([p, -1]);
                    while (this.potentialPlaceIndex < 4) {
                        if (
                            this.positions.indexOf(this.potentialPlace + p) !== -1 &&
                            (!(Math.abs(this.potentialPlace) === 1) ||
                                Math.floor((this.potentialPlace + p) / 10) - Math.floor(p / 10) ===
                                    0)
                        ) {
                            this.potentialCell = this.potentialPlace + p;
                            break;
                        } else {
                            this.potentialPlaceIndex += 1;
                            this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
                        }
                    }
                } else {
                    this.potentialShip[0][1] = this.potentialPlaceIndex;

                    if (
                        this.positions.indexOf(this.potentialPlace + p) !== -1 &&
                        (!(Math.abs(this.potentialPlace) === 1) ||
                            Math.floor((this.potentialPlace + p) / 10) - Math.floor(p / 10) === 0)
                    ) {
                        this.potentialCell = this.potentialPlace + p;
                    } else {
                        this.potentialPlaceIndex += 2;
                        this.potentialShip[0][1] = this.potentialPlaceIndex;
                        this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
                        this.potentialCell = this.potentialPlace + this.potentialShip[0][0];
                    }
                }
            } else {
                this.potentialShip = [];
                this.potentialCell = null;
                this.potentialPlaceIndex = 0;
                this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
            }
        } else {
            if (this.potentialShip.length !== 0) {
                if (this.potentialShip[0][1] === -1) {
                    const p = this.potentialShip[0][0];
                    this.potentialPlaceIndex += 1;
                    this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
                    while (this.potentialPlaceIndex < 4) {
                        if (
                            this.positions.indexOf(this.potentialPlace + p) !== -1 &&
                            (!(Math.abs(this.potentialPlace) === 1) ||
                                Math.floor((this.potentialPlace + p) / 10) - Math.floor(p / 10) ===
                                    0)
                        ) {
                            this.potentialCell = this.potentialPlace + p;
                            break;
                        } else {
                            this.potentialPlaceIndex += 1;
                            this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
                        }
                    }
                } else {
                    this.potentialPlaceIndex += 2;
                    this.potentialShip[0][1] = this.potentialPlaceIndex;
                    this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
                    this.potentialCell = this.potentialPlace + this.potentialShip[0][0];
                }
            } else {
                this.potentialCell = null;
            }
        }
    }

    updateCells(cells) {
        for (let i of cells) {
            const [firstC, secondC] = i;

            const p = 10 * firstC + secondC;

            if (this.positions.indexOf(p) !== -1)
                this.positions.splice(this.positions.indexOf(p), 1);
        }
    }

    reset() {
        this.positions = Array.from({ length: 100 }, (_, i) => i + 10);
        this.potentialShip = [];
        this.potentialCell = null;
        this.potentialPlaces = [-10, 1, 10, -1];
        this.potentialPlaceIndex = 0;
        this.potentialPlace = this.potentialPlaces[this.potentialPlaceIndex];
    }
}
