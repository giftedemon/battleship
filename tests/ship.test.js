import Ship from "../src/modules/Ship";

describe("Testing the length of the ships", () => {
    test("Should be no less than 1", () => {
        expect(() => new Ship(0)).toThrow("Invalid length");
    });
});

test("Should sink after 4 hits", () => {
    const s = new Ship(4);
    s.hit();
    s.hit();
    s.hit();
    s.hit();
    expect(s.isSunk()).toBe(true);
});
