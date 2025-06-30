import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError } from "../error.js";

export async function handlerPostUsers(req: Request, res: Response) {
    const email = req.body.email;

    if (!email) {
        throw new BadRequestError("Missing property: email");
    }

    const newUser: NewUser = {
        email
    };

    const result = await createUser(newUser);
    res.status(201).json(result);
}