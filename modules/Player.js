import Gameboard from "../modules/Gameboard";

class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
    }
}
