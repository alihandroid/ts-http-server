import { Request, response, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerLogin(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;
    let expiresInSeconds = req.body.expiresInSeconds ?? 1 * 60 * 60; // 1 hour by default
    if (expiresInSeconds > 1 * 60 * 60) {
        expiresInSeconds = 1 * 60 * 60; // max 1 hour
    }

    if (!email) {
        throw new BadRequestError("Missing property: email");
    }

    if (!password) {
        throw new BadRequestError("Missing property: password");
    }

    const user = await getUserByEmail(email);

    if (!user) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    if (!await checkPasswordHash(password, user.hashedPassword)) {
        throw new UnauthorizedError("Incorrect email or password");
    }

    const { hashedPassword, ...response } = user;

    const token = makeJWT(user.id, expiresInSeconds, config.jwtSecret);

    res.status(200).json({ ...response, token });
}