import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv"
import * as jwt from 'jsonwebtoken';
dotenv.config()
const ACCESS_TOKEN_SECRET: any = process.env.SECRET_CODE

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.header("authtoken")
        if (!authToken) {
            res.status(401).send({
                message: "Access Denied (Unauthorized) ",
                status: "401",
                success: 0,
                data: {}
            });
        } else {
            const tokenVerify = await jwt.verify(authToken, ACCESS_TOKEN_SECRET, { ignoreExpiration: true })
            if (tokenVerify) {
                res.locals.id = tokenVerify
                next()
            } else {
                res.status(401).send({
                    message: "Access Denied (Unauthorized) ",
                    status: "401",
                    success: 0,
                    data: {}
                });

            }
        }
    } catch (error) {
        next(error)

    }
}

export default auth