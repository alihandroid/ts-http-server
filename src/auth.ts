import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { Request } from "express";
import { UnauthorizedError } from "./error.js";

const saltRounds = 10;

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, saltRounds);
}

export async function checkPasswordHash(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userId: string, expiresIn: number, secret: string) {
    const now = Math.floor(Date.now() / 1000);
    const payload: payload = {
        iss: "chirpy",
        sub: userId,
        iat: now,
        exp: now + expiresIn
    };

    return jwt.sign(payload, secret);
}

export function validateJWT(tokenString: string, secret: string) {
    let token;

    try {
        token = jwt.verify(tokenString, secret, { issuer: "chirpy" });
    } catch (err) {
        throw new UnauthorizedError("JWT is invalid");
    }

    if (typeof token === "string") {
        console.log("validateJMT: " + token);
        throw new Error("Expected JWTPayload");
    }

    const userId = token.sub;

    if (!userId) {
        throw new UnauthorizedError("JWT is invalid");
    }

    return userId;
}

export function getBearerToken(req: Request) {
    const auth = req.get("Authorization");

    if (!auth) {
        throw new Error("Authorization does not exist");
    }

    if (!auth.startsWith("Bearer ")) {
        throw new Error("Authorization is not a Bearer token");
    }

    return auth.slice(7);
}

export function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}