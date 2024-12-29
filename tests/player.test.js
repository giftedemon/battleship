import Player from "../src/modules/Player";

const player1Ships = [
    { coordinate: "2B", direction: "d", length: 1 },
    { coordinate: "1E", direction: "d", length: 1 },
    { coordinate: "2G", direction: "r", length: 3 },
    { coordinate: "4A", direction: "r", length: 2 },
    { coordinate: "4E", direction: "d", length: 4 },
    { coordinate: "5I", direction: "d", length: 1 },
    { coordinate: "8H", direction: "r", length: 1 },
    { coordinate: "9B", direction: "d", length: 2 },
    { coordinate: "9D", direction: "r", length: 3 },
    { coordinate: "10H", direction: "r", length: 2 },
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

        const coord = "2G";
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

        const coord = "2G";
        const { changedCells, hit, end, validTurn, sunk } = player.gameboard.receiveAttack(coord);
        const hitCell = [2, 6];
        cpu.updateInfo({ cells: changedCells, sunk, hit, hitCell });

        expect(cpu.attack()).toBe("1G");
    });
});
