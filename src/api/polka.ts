import { Request, Response } from "express";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../error.js";
import { upgradeUserToChirpyRed } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

type PolkaWebhookRequest = {
    event: "user.upgraded" | string,
    data: {
        userId: string,
    }
}

export async function handlerPolkaWebhooks(req: Request, res: Response) {
    const apiKey = getAPIKey(req);

    if (apiKey !== config.polkaKey) {
        throw new UnauthorizedError("Wrong API Key");
    }

    if (!req.body.event || !req.body.data?.userId) {
        throw new BadRequestError("Malformed request body");
    }

    const body: PolkaWebhookRequest = {
        event: req.body.event,
        data: {
            userId: req.body.data.userId,
        }
    }

    if (body.event !== "user.upgraded") {
        res.sendStatus(204);
        return;
    }

    const user = await upgradeUserToChirpyRed(body.data.userId);

    if (!user) {
        throw new NotFoundError("User not found");
    }

    res.sendStatus(204);
}