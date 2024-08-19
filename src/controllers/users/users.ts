import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, validateRequestQuery, titleCase } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const userList = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/users/list`;
    const domainUrl = req.protocol + '://' + req.headers.host + "/"
    let result: any = {};

    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const key: string = validateRequestQuery(req.query.key, "numCharSpace");
    const page: number = validateRequestQuery(req.query.page, "num");
    const column: string = validateRequestQuery(req.query.column, "any");
    const direction = validateRequestQuery(
        req.query.direction,
        "char"
    ).toUpperCase();

    let params = {
        key: key,
        column: column,
        direction: direction,
        limitQuery: "",
    };
    try {
        let countUsers: any = await model.countUsers();
        result.countUsers = countUsers.data;

        let totalUsers = countUsers[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalUsers);
        
        const userList = await model.userList(params, domainUrl)
        result.listUsers = userList.data;

        const tabling: any = [
            {
              key: "no",
              title: "No",
              dataIndex: "no",
              sorter: false,
            },
          ];
        
          userList.length > 0
            ? Object.keys(userList[0])
                .filter((item: any) => item !== "id")
                .map((item: any, indx: any) =>
                  tabling.push({
                    key: indx,
                    title: titleCase(item),
                    dataIndex: item,
                    sorter: true,
                  })
                )
            : tabling.push({
                key: "5",
                title: "Columns",
                dataIndex: "columns",
                sorter: true,
              });

        const data = {
            tabling: tabling,
            dataPerPage: paginations.dataPerPage,
            currentPage: paginations.currentPage,
            totalData: paginations.totalData,
            totalPage: paginations.totalPage,
            data: userList,
        }

        return responseHandle(req, res, "success", "userList", data, 200)
    } catch (error) {
        next(error)
    }
}

export const userByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const userByid = await model.userByid(id)
        return responseHandle(req, res, "users", "userByid", userByid, 200)
    } catch (error) {
        next(error)
    }
}

export const insertUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = validateRequestQuery(req.body.username, "char");
    let password = req.body.password;
    let firstname = validateRequestQuery(req.body.firstname, "char");
    let lastname = validateRequestQuery(req.body.lastname, "char");
    let email = req.body.email;
    let gender = validateRequestQuery(req.body.gender, "char");
    let birthdate = validateRequestQuery(req.body.birthdate, "char");
    
    let verifyPassword = bcrypt.hashSync(password, salt);

    try {
        let response: any = await model.searchUser(username, 0, "insert");
        if (username == "" || firstname == "" || lastname == "" || email == "" || gender == "" || birthdate == "" || password == "") {
            errorHandle(req, res, "Data user tidak lengkap.", "users", response, 500)
        }
        if (response?.length < 1) {
            let insertUser: any = await model.insertUser(
                username,
                firstname,
                lastname,
                email,
                birthdate,
                gender,
                verifyPassword
            );
            if (insertUser.insertId != 0) {
                // berhasil
                responseHandle(req, res, "insert data success", "users", [], 200)
            } else {
                // gagal
                responseHandle(req, res, "Gagal regis", "users", [], 400)
            }
        } else {
            responseHandle(req, res, "Username already used", "users", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
    let username = validateRequestQuery(req.body.username, "char");
    let password = req.body.password;
    let firstname = validateRequestQuery(req.body.firstname, "char");
    let lastname = validateRequestQuery(req.body.lastname, "char");
    let email = req.body.email;
    let gender = validateRequestQuery(req.body.gender, "char");
    let birthdate = validateRequestQuery(req.body.birthdate, "char");
    let id = validateRequestQuery(req.body.id, "num");

    let verifyPassword = bcrypt.hashSync(password, salt);
    try {
        let searchUser: any = await model.searchUser(username, id, "edit");
        if (username == "" || firstname == "" || lastname == "" || email == "" || gender == "" || birthdate == "" || password == "" || id == "") {
            return responseHandle(req, res, "Parameter Not Found", "users", [], 500)
        }
        if (searchUser?.length > 0) {
            let editUser: any = await model.editUser(
                username,
                firstname,
                lastname,
                email,
                birthdate,
                gender,
                verifyPassword,
                id
            );
            return responseHandle(req, res, "Update Success", "users", [], 200)
        } else {
            return responseHandle(req, res, "Username is already exist", "users", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let response: any = await model.deleteUser(id);
        if (response) {
            responseHandle(req, res, "Update Success", "Delete", response, 200)
        }
    } catch (err) {
       next(err)
    }
}