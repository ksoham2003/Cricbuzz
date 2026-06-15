import test from "node:test";
import assert from "node:assert/strict";
import CommentaryService from "../src/modules/commentary/commentary.service.js";

test("addCommentary creates and broadcasts commentary to the match room", async () => {
    const createdCommentary = { _id: "commentary-id" };
    const repository = {
        createCommentary: async () => createdCommentary,
    };
    const emitted = [];
    const io = {
        to(room) {
            return {
                emit(event, payload) {
                    emitted.push({ room, event, payload });
                },
            };
        },
    };
    const service = new CommentaryService(repository);
    service._ensureMatchIsLive = async () => {};

    const result = await service.addCommentary(
        { matchId: "684b6a34c2fdb6f62f73d781" },
        io
    );

    assert.equal(result, createdCommentary);
    assert.deepEqual(emitted, [{
        room: "match:684b6a34c2fdb6f62f73d781",
        event: "commentary.created",
        payload: createdCommentary,
    }]);
});

test("fetchCommentary returns pagination metadata", async () => {
    const repository = {
        getCommentaryByMatch: async () => ({
            commentary: [{ text: "Latest ball" }],
            total: 21,
        }),
    };
    const service = new CommentaryService(repository);

    const result = await service.fetchCommentary(
        "684b6a34c2fdb6f62f73d781",
        { page: 2, limit: 10 }
    );

    assert.equal(result.pagination.totalPages, 3);
    assert.equal(result.commentary[0].text, "Latest ball");
});

test("removeCommentary rejects an unknown commentary id", async () => {
    const repository = {
        findCommentaryById: async () => null,
    };
    const service = new CommentaryService(repository);

    await assert.rejects(
        service.removeCommentary("684b6a34c2fdb6f62f73d781"),
        (error) => error.statusCode === 404 && error.message === "Commentary not found"
    );
});
