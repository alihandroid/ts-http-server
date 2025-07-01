import { Request, Response } from "express";
import { createUser, updateUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "../error.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { config } from "../config.js";

export async function handlerPostUsers(req: Request, res: Response) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email) {
        throw new BadRequestError("Missing property: email");
    }

    if (!password) {
        throw new BadRequestError("Missing property: password");
    }

    const newUser: NewUser = {
        email,
        hashedPassword: await hashPassword(password),
    };

    const result = await createUser(newUser);
    const { hashedPassword, ...response } = result;

    res.status(201).json(response);
}

export async function handlerPutUsers(req: Request, res: Response) {
    const accessTokenStr = getBearerToken(req);

    if (!req.body.email) {
        throw new BadRequestError("Missing property: email");
    }

    if (!req.body.password) {
        throw new BadRequestError("Missing property: password");
    }

    const userId = validateJWT(accessTokenStr, config.jwtSecret);

    const user: NewUser = {
        email: req.body.email,
        hashedPassword: await hashPassword(req.body.password),
    };

    const result = await updateUser(userId, user);

    const { hashedPassword, ...response } = result;

    res.status(200).send(response);
}