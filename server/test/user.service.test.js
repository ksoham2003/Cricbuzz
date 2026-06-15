import test from "node:test";
import assert from "node:assert/strict";
import UserService from "../src/modules/users/user.service.js";
import bcrypt from "bcryptjs";

test("createUser hashes the password and returns status", async () => {
    let createdUser = null;
    const service = new UserService();
    service.userRepository = {
        findByEmail: async () => null,
        create: async (data) => {
            createdUser = data;
            return {
                _id: "user-123",
                ...data,
                status: "ACTIVE",
            };
        },
    };

    const result = await service.createUser({
        name: "Test User",
        email: "test@example.com",
        password: "secretpassword",
        role: "ADMIN",
    });

    assert.equal(result.id, "user-123");
    assert.equal(result.email, "test@example.com");
    assert.equal(result.status, "ACTIVE");
    assert.equal(result.role, "ADMIN");

    // Verify password is encrypted and not plaintext
    assert.notEqual(createdUser.password, "secretpassword");
    const isMatch = await bcrypt.compare("secretpassword", createdUser.password);
    assert.equal(isMatch, true);
});

test("getAllUsers applies role, status, and search filters correctly", async () => {
    let capturedFilter = null;
    const service = new UserService();
    service.userRepository = {
        findAll: async (filter, options) => {
            capturedFilter = filter;
            return [];
        },
        countAll: async (filter) => {
            return 0;
        },
    };

    await service.getAllUsers({
        role: "SCORER",
        status: "INACTIVE",
        search: "bob",
    });

    assert.deepEqual(capturedFilter, {
        isDeleted: false,
        role: "SCORER",
        status: "INACTIVE",
        name: { $regex: "bob", $options: "i" },
    });
});

test("deleteUser throws error if deleting yourself", async () => {
    const service = new UserService();
    // Pass same ID for target user and current user
    await assert.rejects(
        service.deleteUser("user-123", "user-123"),
        (err) => err.statusCode === 400 && err.message === "Cannot delete your own account"
    );
});

test("deleteUser soft deletes user when target is different", async () => {
    let deletedId = null;
    const service = new UserService();
    service.userRepository = {
        findById: async (id) => {
            if (id === "user-456") return { _id: "user-456" };
            return null;
        },
        softDelete: async (id) => {
            deletedId = id;
            return { _id: id, isDeleted: true };
        },
    };

    const result = await service.deleteUser("user-456", "user-123");
    assert.equal(deletedId, "user-456");
    assert.equal(result.message, "User deleted successfully");
});

test("updateUserProfile allows updating name, role, and status", async () => {
    let updatedId = null;
    let updatedData = null;
    const service = new UserService();
    service.userRepository = {
        findById: async (id) => {
            if (id === "user-789") return { _id: "user-789", email: "user@example.com" };
            return null;
        },
        update: async (id, data) => {
            updatedId = id;
            updatedData = data;
            return {
                _id: id,
                email: "user@example.com",
                name: data.name,
                role: data.role,
                status: data.status,
                picture: data.picture,
            };
        },
    };

    const result = await service.updateUserProfile("user-789", {
        name: "New Name",
        role: "ADMIN",
        status: "INACTIVE",
        picture: "https://example.com/pic.png",
    });

    assert.equal(updatedId, "user-789");
    assert.deepEqual(updatedData, {
        name: "New Name",
        role: "ADMIN",
        status: "INACTIVE",
        picture: "https://example.com/pic.png",
    });
    assert.equal(result.name, "New Name");
    assert.equal(result.role, "ADMIN");
    assert.equal(result.status, "INACTIVE");
    assert.equal(result.picture, "https://example.com/pic.png");
});
