class Ship {
    constructor(length) {
        if (!this.checkLength(length)) {
            throw Error("Invalid length");
        }
        this.length = length;
        this.hitCount = 0;
    }

    checkLength(length) {
        if (length < 1 || length > 4) {
            return false;
        }
        return true;
    }

    hit() {
        this.hitCount += 1;
        this.isSunk();
    }

    isSunk() {
        if (this.hitCount === this.length) {
            return true;
        }
    }
}

module.exports = Ship;
