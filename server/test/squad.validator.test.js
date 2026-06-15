import test from "node:test";
import assert from "node:assert/strict";
import {
    createSquadSchema,
    addPlayerSchema,
    updateStatusSchema,
    squadIdSchema,
} from "../src/modules/squad/squad.validator.js";

const validId = "507f1f77bcf86cd799439011";

test("createSquadSchema accepts valid objectIds", () => {
    const result = createSquadSchema.safeParse({
        seriesId: validId,
        teamId: validId,
    });
    assert.equal(result.success, true);
});

test("createSquadSchema rejects invalid objectIds", () => {
    const result = createSquadSchema.safeParse({
        seriesId: "invalid-id",
        teamId: validId,
    });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid series ID");
});

test("addPlayerSchema accepts valid player ID", () => {
    const result = addPlayerSchema.safeParse({
        playerId: validId,
    });
    assert.equal(result.success, true);
});

test("addPlayerSchema rejects invalid player ID", () => {
    const result = addPlayerSchema.safeParse({
        playerId: "invalid-id",
    });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid player ID");
});

test("updateStatusSchema accepts ACTIVE and LOCKED", () => {
    const activeResult = updateStatusSchema.safeParse({ status: "ACTIVE" });
    const lockedResult = updateStatusSchema.safeParse({ status: "LOCKED" });
    assert.equal(activeResult.success, true);
    assert.equal(lockedResult.success, true);
});

test("updateStatusSchema rejects invalid status values", () => {
    const result = updateStatusSchema.safeParse({ status: "INACTIVE" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Status must be either ACTIVE or LOCKED");
});

test("squadIdSchema accepts valid hex id", () => {
    const result = squadIdSchema.safeParse({ id: validId });
    assert.equal(result.success, true);
});

test("squadIdSchema rejects invalid format", () => {
    const result = squadIdSchema.safeParse({ id: "123" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid squad ID");
});
