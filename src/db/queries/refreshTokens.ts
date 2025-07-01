import { and, eq, isNull } from "drizzle-orm";
import { db } from "../index.js";
import { NewResfreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refreshToken: NewResfreshToken) {
    const [result] = await db
        .insert(refreshTokens)
        .values(refreshToken)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getRefreshToken(token: string) {
    const result = await db.query.refreshTokens.findFirst({ where: and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt)) });
    return result;
}

export async function revokeRefreshToken(token: string) {
    await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.token, token));
}