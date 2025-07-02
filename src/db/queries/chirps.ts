import { asc, desc, eq } from "drizzle-orm";
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

export async function getAllChirps(sort: string) {
    const sortFn = sort === "asc" ? asc : desc;
    const result = await db.query.chirps.findMany({ orderBy: sortFn(chirps.createdAt) });
    return result;
}

export async function getChirpById(chirpId: string) {
    const result = await db.query.chirps.findFirst({ where: eq(chirps.id, chirpId) });
    return result;
}

export async function deleteChirpById(chirpId: string) {
    await db.delete(chirps).where(eq(chirps.id, chirpId));
}

export async function getChirpsByAuthorId(authorId: string, sort: string) {
    const sortFn = sort === "asc" ? asc : desc;
    const result = await db.query.chirps.findMany({ orderBy: sortFn(chirps.createdAt), where: eq(chirps.userId, authorId) });
    return result;
}