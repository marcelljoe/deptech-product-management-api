import { NextFunction, Request, Response } from "express";
import { signAccessToken, responseHandle, validateRequestQuery } from '../../config/baseFunction';
import * as model from "./model"
let bcrypt = require("bcryptjs");


export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let username = validateRequestQuery(req.body.username, "char");
        let password = req.body.password;
        let response: any = await model.login(username);
        let data = response[0];
        if (response.length > 0) {
            const authToken = await signAccessToken(data.id, data.level_code)
            const verifiyPassword = bcrypt.compareSync(password, data.password);

            if (data.level_code === 8) {
                return responseHandle(req, res, "Forbidden", "Login", [], 403)
            }

            if (verifiyPassword) {
                return responseHandle(req, res, "Login Success", "Login", { authToken: authToken }, 200)
            } else {
                return responseHandle(req, res, "Username or Password Wrong", "Login", [], 400)
            }
        } else {
            return responseHandle(req, res, "Username or Password Wrong", "Login", [], 400)
        }
    } catch (err) {
        next(err)
    }
};

export const detailUser = async (req: Request, res: Response, next: NextFunction) => {
    const data = res.locals.id
    let id: number = validateRequestQuery(data.id, "num");
    try {
        let response: any = await model.detailUser(id);
        if (response) {
            return responseHandle(req, res, "Success to get data", "detailUser", response, 200)
        } else {
            return responseHandle(req, res, "Failed to get data", "detailUser", [], 400)
        }
    } catch (err) {
        next(err)
    }
};
