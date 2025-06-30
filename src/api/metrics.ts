import { Request, Response } from "express";
import { config } from "../config.js";

export async function handleMetrics(req: Request, res: Response) {
    res.send(`Hits: ${config.fileServerHits}`);
}

export async function handleReset(req: Request, res: Response) {
    config.fileServerHits = 0;
    res.sendStatus(200);
}