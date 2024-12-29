class Ship {
    constructor(length, id = 0) {
        if (!this.checkLength(length)) {
            throw Error("Invalid length");
        }
        this.length = length;
        this.hitCount = 0;
        this.id = id;
    }

    checkLength(length) {
        if (length < 1 || length > 4) {
            return false;
        }
        return true;
    }

    hit() {
        this.hitCount += 1;
    }

    isSunk() {
        if (this.hitCount === this.length) {
            return true;
        }
    }
}

module.exports = Ship;
