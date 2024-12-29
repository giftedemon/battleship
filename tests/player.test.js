import Player from "../src/modules/Player";

const player1Ships = [
    { coordinate: "2m1", direction: "d", length: 1 },
    { coordinate: "1m4", direction: "d", length: 1 },
    { coordinate: "2m6", direction: "r", length: 3 },
    { coordinate: "4m0", direction: "r", length: 2 },
    { coordinate: "4m4", direction: "d", length: 4 },
    { coordinate: "5m8", direction: "d", length: 1 },
    { coordinate: "8m7", direction: "r", length: 1 },
    { coordinate: "9m1", direction: "d", length: 2 },
    { coordinate: "9m3", direction: "r", length: 3 },
    { coordinate: "10m7", direction: "r", length: 2 },
];

describe("Testing CPU", () => {
    test("Random attacks", () => {
        const cpu = new Player("cpu");
        const coord = cpu.attack();

        expect(cpu.positions).not.toContain(coord);
    });

    test("Several attack", () => {
        const player = new Player();
        const cpu = new Player("cpu");

        for (let i = 0; i < player1Ships.length; i++) {
            const { coordinate, direction, length } = player1Ships[i];
            player.gameboard.placeShip(coordinate, direction, length);
        }

        const coord = "2m6";
        const { changedCells, hit, end, validTurn } = player.gameboard.receiveAttack(coord);
        cpu.updateCells(changedCells);

        expect(cpu.positions.length).toBe(95);
    });

    test("Smart CPU", () => {
        const player = new Player();
        const cpu = new Player("cpu");

        for (let i = 0; i < player1Ships.length; i++) {
            const { coordinate, direction, length } = player1Ships[i];
            player.gameboard.placeShip(coordinate, direction, length);
        }

        const coord = "2m6";
        const { changedCells, hit, end, validTurn, sunk } = player.gameboard.receiveAttack(coord);
        const hitCell = [2, 6];
        cpu.updateInfo({ cells: changedCells, sunk, hit, hitCell });

        expect(cpu.attack()).toBe("1m6");
    });
});
