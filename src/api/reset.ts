import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../error.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
    if (config.platform !== "dev") {
        throw new ForbiddenError("Not allowed");
    }
    config.fileServerHits = 0;
    deleteUsers();
    res.sendStatus(200);
}