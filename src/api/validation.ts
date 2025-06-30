import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    type responseData = {
        valid?: boolean;
        error?: string;
    };

    let parsedBody: parameters = req.body;

    if (!parsedBody.body) {
        const resBody: responseData = {
            error: "Missing property: body",
        };
        res.contentType("application/json");
        res.status(400).send(JSON.stringify(resBody));
        return;
    }

    if (parsedBody.body.length > 140) {
        const resBody: responseData = {
            error: "Chirp is too long"
        };
        res.contentType("application/json");
        res.status(400).send(JSON.stringify(resBody));
        return;
    }

    const resBody: responseData = {
        valid: true
    };
    res.contentType("application/json");
    res.status(200).send(JSON.stringify(resBody));
}