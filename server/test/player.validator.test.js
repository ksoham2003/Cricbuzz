import test from "node:test";
import assert from "node:assert/strict";
import {
    createPlayerSchema,
    updatePlayerSchema,
} from "../src/modules/player/player.validator.js";

const validPlayerInput = {
    firstName: "Virat",
    lastName: "Kohli",
    age: 37,
    role: "BATSMAN",
    teamId: "684b6a34c2fdb6f62f73d781",
    jerseyNumber: 18,
    battingStyle: "RIGHT_HAND_BAT",
    nationality: "Indian",
};

test("createPlayerSchema accepts valid player inputs", () => {
    const result = createPlayerSchema.safeParse(validPlayerInput);
    assert.equal(result.success, true);
});

test("createPlayerSchema rejects age < 10", () => {
    const result = createPlayerSchema.safeParse({ ...validPlayerInput, age: 9 });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid player age");
});

test("createPlayerSchema rejects invalid roles", () => {
    const result = createPlayerSchema.safeParse({ ...validPlayerInput, role: "SPECTATOR" });
    assert.equal(result.success, false);
    assert.match(result.error.issues[0].message, /expected one of/);
});

test("createPlayerSchema rejects invalid teamId format", () => {
    const result = createPlayerSchema.safeParse({ ...validPlayerInput, teamId: "invalid-id" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Team ID must be a valid ObjectId");
});

test("createPlayerSchema rejects negative jersey numbers", () => {
    const result = createPlayerSchema.safeParse({ ...validPlayerInput, jerseyNumber: -1 });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Jersey number cannot be negative");
});

test("updatePlayerSchema accepts partial data", () => {
    const result = updatePlayerSchema.safeParse({
        age: 38,
        status: "INJURED",
    });
    assert.equal(result.success, true);
});
