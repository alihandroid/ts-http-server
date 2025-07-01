import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./error";

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