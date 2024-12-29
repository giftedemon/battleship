import Gameboard from "../src/modules/Gameboard";
import Ship from "../src/modules/Ship";
describe("Test ship placement", () => {
    test("Correct placement in r direction", () => {
        const g = new Gameboard();
        g.placeShip("1A", "r", 1);
        const s = new Ship(1);
        expect(g.board).toStrictEqual({
            1: [s, ...new Array(9).fill(".")],
            2: new Array(10).fill("."),
            3: new Array(10).fill("."),
            4: new Array(10).fill("."),
            5: new Array(10).fill("."),
            6: new Array(10).fill("."),
            7: new Array(10).fill("."),
            8: new Array(10).fill("."),
            9: new Array(10).fill("."),
            10: new Array(10).fill("."),
        });

        g.receiveAttack("1A");

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

        g.receiveAttack("2A");

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
        g.placeShip("1A", "d", 3);
        const s = new Ship(3);
        expect(g.board).toStrictEqual({
            1: [s, ...new Array(9).fill(".")],
            2: [s, ...new Array(9).fill(".")],
            3: [s, ...new Array(9).fill(".")],
            4: new Array(10).fill("."),
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
        expect(() => g.placeShip("1A", "r", 7)).toThrow("Invalid length");
    });

    test("Invalid placement in down direction", () => {
        const g = new Gameboard();
        expect(() => g.placeShip("9A", "d", 3)).toThrow("Invalid fit");
    });

    test("Invalid placement in right direction", () => {
        const g = new Gameboard();
        expect(() => g.placeShip("9H", "r", 4)).toThrow("Invalid fit");
    });
});

describe("Testing coords", () => {
    test("10th row", () => {
        const g = new Gameboard();
        g.placeShip("10H", "r", 2);
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
            9: new Array(10).fill("."),
            10: [...new Array(7).fill("."), s, s, "."],
        });
    });
});
