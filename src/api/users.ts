import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "../error.js";
import { hashPassword } from "../auth.js";

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