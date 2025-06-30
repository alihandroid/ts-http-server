import { Request, Response } from "express";
import { config } from "../config.js";

export async function handlerMetrics(req: Request, res: Response) {
    res.contentType("text/html; charset=utf-8");
    res.send(`
<html>
    <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileServerHits} times!</p>
    </body>
</html>`
    );
}

export async function handlerReset(req: Request, res: Response) {
    config.fileServerHits = 0;
    res.sendStatus(200);
}