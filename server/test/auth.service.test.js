import test from "node:test";
import assert from "node:assert/strict";
import AuthService from "../src/modules/auth/auth.service.js";

test("getCurrentUser returns user object without sensitive credentials", async () => {
    const mockUser = {
        _id: "user-id-123",
        name: "Test Scorer",
        email: "scorer@cricbuzz.com",
        password: "hashedpassword123",
        refreshToken: "hashedrefreshtoken123",
        role: "SCORER",
        isDeleted: false,
    };

    const service = new AuthService();
    service.authRepository = {
        findById: async (id) => {
            if (id === "user-id-123") return mockUser;
            return null;
        }
    };

    const result = await service.getCurrentUser("user-id-123");

    assert.equal(result._id, "user-id-123");
    assert.equal(result.name, "Test Scorer");
    assert.equal(result.email, "scorer@cricbuzz.com");
    assert.equal(result.role, "SCORER");
    assert.equal(result.password, undefined);
    assert.equal(result.refreshToken, undefined);
});

test("getCurrentUser throws 404 for deleted or non-existent user", async () => {
    const mockDeletedUser = {
        _id: "deleted-user",
        name: "Deleted User",
        isDeleted: true,
    };

    const service = new AuthService();
    service.authRepository = {
        findById: async (id) => {
            if (id === "deleted-user") return mockDeletedUser;
            return null;
        }
    };

    await assert.rejects(
        service.getCurrentUser("deleted-user"),
        (err) => err.statusCode === 404 && err.message === "User not found"
    );

    await assert.rejects(
        service.getCurrentUser("non-existent"),
        (err) => err.statusCode === 404 && err.message === "User not found"
    );
});
