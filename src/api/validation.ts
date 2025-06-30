import { Request, Response } from "express";
import { BadRequestError } from "../error.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    type responseData = {
        cleanedBody: string;
    };

    let parsedBody: parameters = req.body;

    if (!parsedBody.body) {
        throw new BadRequestError("Missing property: body");
    }

    if (parsedBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const badWords = ["kerfuffle", "sharbert", "fornax"];
    const cleanedBody = parsedBody.body.split(" ").map(x => badWords.includes(x.toLowerCase()) ? "****" : x).join(" ");

    const resBody: responseData = {
        cleanedBody
    };
    res.contentType("application/json");
    res.status(200).json(resBody);
}