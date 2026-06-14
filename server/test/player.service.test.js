import test from "node:test";
import assert from "node:assert/strict";
import PlayerService from "../src/modules/player/player.service.js";

test("createPlayer throws error if team does not exist", async () => {
    const service = new PlayerService();
    // mock ensureTeamExists to simulate team not found
    service._ensureTeamExists = async () => {
        const { ApiError } = await import("../src/utils/ApiError.js");
        throw new ApiError(404, "Team not found");
    };

    await assert.rejects(
        service.createPlayer({
            firstName: "Virat",
            lastName: "Kohli",
            age: 37,
            role: "BATSMAN",
            teamId: "684b6a34c2fdb6f62f73d781",
        }, "admin-id"),
        (err) => err.statusCode === 404 && err.message === "Team not found"
    );
});

test("createPlayer throws error if jersey number already exists in team", async () => {
    const service = new PlayerService();
    service._ensureTeamExists = async () => {};
    service.playerRepository = {
        findPlayerByJersey: async () => ({ _id: "other-player" }),
    };

    await assert.rejects(
        service.createPlayer({
            firstName: "Virat",
            lastName: "Kohli",
            age: 37,
            role: "BATSMAN",
            teamId: "684b6a34c2fdb6f62f73d781",
            jerseyNumber: 18,
        }, "admin-id"),
        (err) => err.statusCode === 400 && err.message === "Jersey number already exists"
    );
});

test("updatePlayer throws error if jersey number conflicts", async () => {
    const service = new PlayerService();
    service.getPlayerById = async () => ({
        _id: "player-id",
        firstName: "Virat",
        lastName: "Kohli",
        age: 37,
        role: "BATSMAN",
        teamId: "684b6a34c2fdb6f62f73d781",
        jerseyNumber: 18,
    });
    service._ensureTeamExists = async () => {};
    service.playerRepository = {
        findPlayerByJersey: async () => ({ _id: "other-player" }),
    };

    await assert.rejects(
        service.updatePlayer("player-id", {
            jerseyNumber: 45,
        }),
        (err) => err.statusCode === 400 && err.message === "Jersey number already exists"
    );
});
