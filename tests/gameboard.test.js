import Gameboard from "../src/modules/Gameboard";
import Ship from "../src/modules/Ship";
describe("Test ship placement", () => {
    test("Correct placement in r direction", () => {
        const g = new Gameboard();
        g.placeShip("1m0", "r", 1);
        const s = new Ship(1);
        expect(g.board).toStrictEqual({
            1: [s, "o", ...new Array(8).fill(".")],
            2: ["o", "o", ...new Array(8).fill(".")],
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });

        g.receiveAttack("1m0");

        expect(g.board).toStrictEqual({
            1: ["X", "·", ...new Array(8).fill(".")],
            2: ["·", "·", ...new Array(8).fill(".")],
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });

        g.receiveAttack("2m0");

        expect(g.board).toStrictEqual({
            1: ["X", "·", ...new Array(8).fill(".")],
            2: ["·", "·", ...new Array(8).fill(".")],
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });

        expect(g.ships).toBe(0);
    });

    test("Correct placement in d direction", () => {
        const g = new Gameboard();
        g.placeShip("1m0", "d", 3);
        const s = new Ship(3);
        expect(g.board).toStrictEqual({
            1: [s, "o", ...new Array(8).fill(".")],
            2: [s, "o", ...new Array(8).fill(".")],
            3: [s, "o", ...new Array(8).fill(".")],
            4: ["o", "o", ...new Array(8).fill(".")],
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });
    });

    test("Invalid length", () => {
        const g = new Gameboard();
        expect(() => g.placeShip("1m0", "r", 7)).toThrow("Invalid length");
    });

    test("Invalid placement in down direction", () => {
        const g = new Gameboard();
        expect(g.placeShip("9m0", "d", 3)).toBe("Invalid fit");
    });

    test("Invalid placement in right direction", () => {
        const g = new Gameboard();
        expect(g.placeShip("9m7", "r", 4)).toBe("Invalid fit");
    });
});

describe("Testing coords", () => {
    test("10th row", () => {
        const g = new Gameboard();
        g.placeShip("10m7", "r", 2);
        const s = new Ship(2);
        expect(g.board).toStrictEqual({
            1: new Array(10).fill("."),
            2: new Array(10).fill("."),
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: [...new Array(6).fill("."), "o", "o", "o", "o"],
            10: [...new Array(6).fill("."), "o", s, s, "o"],
        });
    });
});

describe("Detailed ship placement", () => {
    const g = new Gameboard();
    g.placeShip("2m2", "r", 3);
    const s = new Ship(3);

    test("Ship placement and invalidness of surrounding cells", () => {
        expect(g.board).toStrictEqual({
            1: [".", "o", "o", "o", "o", "o", ...new Array(4).fill(".")],
            2: [".", "o", s, s, s, "o", ...new Array(4).fill(".")],
            3: [".", "o", "o", "o", "o", "o", ...new Array(4).fill(".")],
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });
    });

    test("Error when trying to put a ship in surrounding cells", () => {
        expect(g.placeShip("3m2", "d", 1)).toBe("Invalid placement");
    });
});
