import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth";

describe("Password Hashing", () => {
    const password1 = "correctPassword123!";
    const password2 = "anotherPassword456!";
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it("should return true for the correct password", async () => {
        const result1 = await checkPasswordHash(password1, hash1);
        expect(result1).toBe(true);
        const result2 = await checkPasswordHash(password2, hash2);
        expect(result2).toBe(true);
    });
});

describe("JWT", () => {
    const userId = "test";
    const secret = "secret";

    it("should make and validate JWTs", () => {
        const jwt = makeJWT(userId, 1000, secret);
        const result = validateJWT(jwt, secret);
        expect(result).toBe(userId);
    });
});