import test from "node:test";
import assert from "node:assert/strict";
import {
    createUserSchema,
    updateUserSchema,
    userIdSchema,
} from "../src/modules/users/user.validator.js";

const validUserInput = {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "ADMIN",
};

test("createUserSchema accepts valid inputs", () => {
    const result = createUserSchema.safeParse(validUserInput);
    assert.equal(result.success, true);
    assert.equal(result.data.name, "John Doe");
    assert.equal(result.data.email, "john@example.com");
    assert.equal(result.data.role, "ADMIN");
});

test("createUserSchema rejects too short name", () => {
    const result = createUserSchema.safeParse({ ...validUserInput, name: "J" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Name must be at least 2 characters");
});

test("createUserSchema rejects invalid email format", () => {
    const result = createUserSchema.safeParse({ ...validUserInput, email: "invalidemail" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid email address");
});

test("createUserSchema rejects short password", () => {
    const result = createUserSchema.safeParse({ ...validUserInput, password: "123" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Password must be at least 6 characters");
});

test("updateUserSchema accepts valid updates including role and status", () => {
    const result = updateUserSchema.safeParse({
        name: "Jane Doe",
        role: "SUPER_ADMIN",
        status: "INACTIVE",
    });
    assert.equal(result.success, true);
    assert.equal(result.data.name, "Jane Doe");
    assert.equal(result.data.role, "SUPER_ADMIN");
    assert.equal(result.data.status, "INACTIVE");
});

test("updateUserSchema rejects unrecognized fields due to strict verification", () => {
    const result = updateUserSchema.safeParse({
        name: "Jane Doe",
        email: "jane@example.com", // should not be allowed
    });
    assert.equal(result.success, false);
});

test("userIdSchema accepts valid 24-character hex ObjectId", () => {
    const result = userIdSchema.safeParse({ id: "507f1f77bcf86cd799439011" });
    assert.equal(result.success, true);
});

test("userIdSchema rejects invalid ObjectId format", () => {
    const result = userIdSchema.safeParse({ id: "invalid-id" });
    assert.equal(result.success, false);
    assert.equal(result.error.issues[0].message, "Invalid user ID");
});
