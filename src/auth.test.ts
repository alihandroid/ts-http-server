import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, getBearerToken, hashPassword, makeJWT, validateJWT } from "./auth";
import { Request } from "express";

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

describe("Bearer token", () => {
    function createRequest(obj: Record<string, string> = {}) {
        const res = new Map();
        for (const key in obj) {
            res.set(key, obj[key]);
        }
        return res as unknown as Request;
    };

    it("should throw an error if there's no Authorization header", () => {
        const req = createRequest();
        expect(() => getBearerToken(req)).toThrow();
    });

    it("should throw an error if Authorization doesn't start with 'Bearer '", () => {
        const req = createRequest({ "Authorization": "Bearer123123" });
        expect(() => getBearerToken(req)).toThrow();
    });

    it("should return the token", () => {
        const req = createRequest({ "Authorization": "Bearer 123123" });
        expect(getBearerToken(req)).toEqual("123123");
    });
})