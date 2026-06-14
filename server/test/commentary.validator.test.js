import test from "node:test";
import assert from "node:assert/strict";
import {
    commentaryPaginationSchema,
    createCommentarySchema,
} from "../src/modules/commentary/commentary.validator.js";

const validCommentary = {
    matchId: "684b6a34c2fdb6f62f73d781",
    over: 10,
    ball: 3,
    text: "FOUR! Beautiful cover drive.",
    type: "FOUR",
};

test("create commentary validation accepts a valid payload", () => {
    const result = createCommentarySchema.safeParse(validCommentary);

    assert.equal(result.success, true);
});

test("create commentary validation rejects ball numbers outside 1 to 6", () => {
    for (const ball of [0, 7]) {
        const result = createCommentarySchema.safeParse({ ...validCommentary, ball });

        assert.equal(result.success, false);
        assert.equal(result.error.issues[0].message, "Invalid ball number");
    }
});

test("pagination validation applies defaults and coerces query strings", () => {
    assert.deepEqual(
        commentaryPaginationSchema.parse({}),
        { page: 1, limit: 20 }
    );
    assert.deepEqual(
        commentaryPaginationSchema.parse({ page: "2", limit: "25" }),
        { page: 2, limit: 25 }
    );
});
