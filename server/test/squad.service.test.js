import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import SquadService from "../src/modules/squad/squad.service.js";

// Setup mongoose connection collection mock
const originalCollection = mongoose.connection.collection;
const mockSeriesId = "684b6a34c2fdb6f62f73d700";
const mockTeamId = "684b6a34c2fdb6f62f73d711";
const mockOtherTeamId = "684b6a34c2fdb6f62f73d722";
const mockPlayerId = "684b6a34c2fdb6f62f73d733";

let mockDatabase = {
    seriesExist: true,
    teamExist: true,
    playerExist: true,
    playerTeamId: mockTeamId,
};

mongoose.connection.collection = (name) => {
    return {
        findOne: async (query) => {
            if (name === "series" && mockDatabase.seriesExist) {
                return { _id: query._id, isDeleted: false };
            }
            if (name === "teams" && mockDatabase.teamExist) {
                return { _id: query._id, isDeleted: false };
            }
            if (name === "players" && mockDatabase.playerExist) {
                return {
                    _id: query._id,
                    teamId: new mongoose.Types.ObjectId(mockDatabase.playerTeamId),
                    isDeleted: false,
                };
            }
            return null;
        },
    };
};

test("createSquad throws error if series not found", async () => {
    mockDatabase.seriesExist = false;
    mockDatabase.teamExist = true;

    const service = new SquadService();

    await assert.rejects(
        service.createSquad({ seriesId: mockSeriesId, teamId: mockTeamId }),
        (err) => err.statusCode === 404 && err.message === "Series not found"
    );
});

test("createSquad throws error if team not found", async () => {
    mockDatabase.seriesExist = true;
    mockDatabase.teamExist = false;

    const service = new SquadService();

    await assert.rejects(
        service.createSquad({ seriesId: mockSeriesId, teamId: mockTeamId }),
        (err) => err.statusCode === 404 && err.message === "Team not found"
    );
});

test("createSquad throws error if squad already exists", async () => {
    mockDatabase.seriesExist = true;
    mockDatabase.teamExist = true;

    const service = new SquadService();
    service.squadRepository = {
        findByTeamAndSeries: async () => ({ _id: "squad-123" }),
    };

    await assert.rejects(
        service.createSquad({ seriesId: mockSeriesId, teamId: mockTeamId }),
        (err) => err.statusCode === 400 && err.message === "Squad already exists"
    );
});

test("createSquad successfully creates a squad", async () => {
    mockDatabase.seriesExist = true;
    mockDatabase.teamExist = true;

    const service = new SquadService();
    service.squadRepository = {
        findByTeamAndSeries: async () => null,
        createSquad: async (data) => ({ _id: "squad-new", ...data }),
    };

    const squad = await service.createSquad({ seriesId: mockSeriesId, teamId: mockTeamId });
    assert.equal(squad._id, "squad-new");
    assert.equal(squad.seriesId, mockSeriesId);
    assert.equal(squad.teamId, mockTeamId);
});

test("addPlayerToSquad throws error if squad is locked", async () => {
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "LOCKED",
            players: [],
        }),
    };

    await assert.rejects(
        service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Squad is locked"
    );
});

test("addPlayerToSquad throws error if max squad size exceeded", async () => {
    // 25 players list
    const maxPlayers = Array.from({ length: 25 }, () => new mongoose.Types.ObjectId());
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: maxPlayers,
        }),
    };

    await assert.rejects(
        service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Maximum squad size exceeded"
    );
});

test("addPlayerToSquad throws error if player not found", async () => {
    mockDatabase.playerExist = false;

    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [],
            teamId: new mongoose.Types.ObjectId(mockTeamId),
        }),
    };

    await assert.rejects(
        service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 404 && err.message === "Player not found"
    );
});

test("addPlayerToSquad throws error if player does not belong to team", async () => {
    mockDatabase.playerExist = true;
    mockDatabase.playerTeamId = mockOtherTeamId; // does not match teamId

    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [],
            teamId: new mongoose.Types.ObjectId(mockTeamId),
        }),
    };

    await assert.rejects(
        service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Player does not belong to team"
    );
});

test("addPlayerToSquad throws error if player already in squad", async () => {
    mockDatabase.playerExist = true;
    mockDatabase.playerTeamId = mockTeamId;

    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [new mongoose.Types.ObjectId(mockPlayerId)],
            teamId: new mongoose.Types.ObjectId(mockTeamId),
        }),
    };

    await assert.rejects(
        service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Player already added to squad"
    );
});

test("addPlayerToSquad successfully adds player", async () => {
    mockDatabase.playerExist = true;
    mockDatabase.playerTeamId = mockTeamId;

    let addedPlayerId = null;
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [],
            teamId: new mongoose.Types.ObjectId(mockTeamId),
        }),
        addPlayer: async (squadId, playerId) => {
            addedPlayerId = playerId;
            return {};
        },
    };

    const result = await service.addPlayerToSquad("507f1f77bcf86cd799439011", mockPlayerId);
    assert.equal(addedPlayerId, mockPlayerId);
    assert.equal(result.message, "Player added successfully");
});

test("removePlayerFromSquad throws error if squad is locked", async () => {
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "LOCKED",
            players: [new mongoose.Types.ObjectId(mockPlayerId)],
        }),
    };

    await assert.rejects(
        service.removePlayerFromSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Squad is locked"
    );
});

test("removePlayerFromSquad throws error if player not in squad", async () => {
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [],
        }),
    };

    await assert.rejects(
        service.removePlayerFromSquad("507f1f77bcf86cd799439011", mockPlayerId),
        (err) => err.statusCode === 400 && err.message === "Player not found in squad"
    );
});

test("removePlayerFromSquad successfully removes player", async () => {
    let removedPlayerId = null;
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: [new mongoose.Types.ObjectId(mockPlayerId)],
        }),
        removePlayer: async (squadId, playerId) => {
            removedPlayerId = playerId;
            return {};
        },
    };

    const result = await service.removePlayerFromSquad("507f1f77bcf86cd799439011", mockPlayerId);
    assert.equal(removedPlayerId, mockPlayerId);
    assert.equal(result.message, "Player removed successfully");
});

test("updateSquadStatus throws error if locking squad with less than 11 players", async () => {
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: Array.from({ length: 10 }, () => new mongoose.Types.ObjectId()), // 10 players
        }),
    };

    await assert.rejects(
        service.updateSquadStatus("507f1f77bcf86cd799439011", "LOCKED"),
        (err) => err.statusCode === 400 && err.message === "Squad must have at least 11 players to be locked"
    );
});

test("updateSquadStatus successfully locks squad with at least 11 players", async () => {
    let statusUpdatedTo = null;
    const service = new SquadService();
    service.squadRepository = {
        findSquadById: async () => ({
            _id: "squad-123",
            status: "ACTIVE",
            players: Array.from({ length: 11 }, () => new mongoose.Types.ObjectId()), // 11 players
        }),
        updateSquad: async (id, data) => {
            statusUpdatedTo = data.status;
            return { _id: id, status: data.status };
        },
    };

    const updated = await service.updateSquadStatus("507f1f77bcf86cd799439011", "LOCKED");
    assert.equal(statusUpdatedTo, "LOCKED");
    assert.equal(updated.status, "LOCKED");
});

// Restore original collection lookup at end of test suite
test("cleanup connection collections mock", () => {
    mongoose.connection.collection = originalCollection;
});
