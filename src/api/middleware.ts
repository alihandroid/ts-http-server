import { NextFunction, Request, Response } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    res.on("finish", () => {
        if (res.statusCode < 300) return;
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    });
    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileServerHits++;
    next();
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) {
    console.error(err);
    res.status(500).json({
        error: "Something went wrong on our end",
    });
}