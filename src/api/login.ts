import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js";
import { createRefreshToken, getRefreshToken, revokeRefreshToken } from "../db/queries/refreshTokens.js";
import { NewResfreshToken } from "../db/schema.js";

export async function handlerLogin(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

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

    const token = makeJWT(user.id, 1 * 60 * 60, config.jwtSecret);
    const refreshToken = makeRefreshToken();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const newResfreshToken: NewResfreshToken = { token: refreshToken, userId: user.id, expiresAt };

    await createRefreshToken(newResfreshToken);

    res.status(200).json({ ...response, token, refreshToken });
}

export async function handlerRefresh(req: Request, res: Response) {
    const refTokenStr = getBearerToken(req);
    const refreshToken = await getRefreshToken(refTokenStr);

    if (!refreshToken) {
        throw new UnauthorizedError("Refresh token does not exist");
    }

    const token = makeJWT(refreshToken.userId, 1 * 60 * 60, config.jwtSecret);

    res.status(200).json({ token });
}

export async function handlerRevoke(req: Request, res: Response) {
    const refTokenStr = getBearerToken(req);
    await revokeRefreshToken(refTokenStr);

    res.sendStatus(204);
}