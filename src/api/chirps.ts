import { Request, Response } from "express";
import { BadRequestError } from "../error.js";
import { NewChirp } from "../db/schema.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerPostChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
        userId: string
    };

    let params: parameters = req.body;

    if (!params.body) {
        throw new BadRequestError("Missing property: body");
    }

    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = params.body.split(" ").map(x => badWords.includes(x.toLowerCase()) ? "****" : x).join(" ");

    const newChirp: NewChirp = {
        body: cleanedBody,
        userId: params.userId
    };

    const result = await createChirp(newChirp);

    res.status(201).json(result);
}