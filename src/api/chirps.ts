import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../error.js";
import { NewChirp } from "../db/schema.js";
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerPostChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    let params: parameters = req.body;

    if (!params.body) {
        throw new BadRequestError("Missing property: body");
    }

    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const token = getBearerToken(req);
    const userId = validateJWT(token, config.jwtSecret);

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = params.body.split(" ").map(x => badWords.includes(x.toLowerCase()) ? "****" : x).join(" ");

    const newChirp: NewChirp = {
        body: cleanedBody,
        userId
    };

    const result = await createChirp(newChirp);

    res.status(201).json(result);
}

export async function handlerGetChirps(req: Request, res: Response) {
    const result = await getAllChirps();

    res.status(200).json(result);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const result = await getChirpById(req.params.chirpId);

    if (!result) {
        throw new NotFoundError("Chirp not found");
    }

    res.status(200).json(result);
}