import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps() {
    const result = await db.query.chirps.findMany({ orderBy: chirps.createdAt });
    return result;
}

export async function getChirpById(chirpId: string) {
    const result = await db.query.chirps.findFirst({ where: eq(chirps.id, chirpId) });
    return result;
}

export async function deleteChirpById(chirpId: string) {
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}