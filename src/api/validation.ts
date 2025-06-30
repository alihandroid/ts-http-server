import { Request, Response } from "express";

export async function handlerValidateChirp(req: Request, res: Response) {
    type requestData = {
        body: string;
    };

    type responseData = {
        valid?: boolean;
        error?: string;
    };

    let body = ""; // 1. Initialize

    // 2. Listen for data events
    req.on("data", (chunk) => {
        body += chunk;
    });

    // 3. Listen for end events
    req.on("end", () => {
        let parsedBody: requestData | undefined = undefined;
        try {
            parsedBody = JSON.parse(body) as requestData;
        } catch (error) {
            const resBody: responseData = {
                error: "Invalid JSON",
            };
            res.contentType("application/json");
            res.status(400).send(JSON.stringify(resBody));
            return;
        }

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
    });
}