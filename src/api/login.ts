import { Request, response, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";

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

    res.status(200).json(response);
}