import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, titleCase, validateRequestQuery } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const dataList = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/product_category/list`;
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
        let countData: any = await model.countList();
        result.countData = countData.data;

        let totalData = countData[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalData);
        params.limitQuery = paginations.query

        const dataList = await model.dataList(params)
        result.listData = dataList.data;

        const tabling: any = [
            {
              key: "no",
              title: "No",
              dataIndex: "no",
              sorter: false,
            },
          ];
        
          dataList.length > 0
            ? Object.keys(dataList[0])
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
            data: dataList,
        }

        return responseHandle(req, res, "success", "Product Category List", data, 200)
    } catch (error) {
        next(error)
    }
}

export const masterStyle = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/product_category/list`;
    const domainUrl = req.protocol + '://' + req.headers.host + "/"
    let result: any = {};
    try {
        const dataList = await model.master()

        return responseHandle(req, res, "success", "Product Category List", dataList, 200)
    } catch (error) {
        next(error)
    }
}

export const categoryByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const catById = await model.categoryByid(id)
        return responseHandle(req, res, "catlist", "categoryById", catById, 200)
    } catch (error) {
        next(error)
    }
}

export const insertData = async (req: Request, res: Response, next: NextFunction) => {
    let name = validateRequestQuery(req.body.name, "char");
    let description = validateRequestQuery(req.body.description, "char");
    
    try {
        let response: any = await model.searchData(name, 0, "insert");
        if (name == "" || description == "") {
            errorHandle(req, res, "Data Kategori tidak lengkap.", "product_cat", response, 500)
        }
        if (response?.length < 1) {
            let insertData: any = await model.insertData(
                name,
                description
            );
            if (insertData.insertId != 0) {
                // berhasil
                responseHandle(req, res, "insert data success", "product_cat", [], 200)
            } else {
                // gagal
                responseHandle(req, res, "Gagal insert", "product_cat", [], 400)
            }
        } else {
            responseHandle(req, res, "Name already used", "product_cat", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const editData = async (req: Request, res: Response, next: NextFunction) => {
    let name = validateRequestQuery(req.body.name, "char");
    let description = validateRequestQuery(req.body.description, "char");
    let id = validateRequestQuery(req.body.id, "num");

    try {
        let searchUser: any = await model.searchData(name, id, "edit");
        if (name == "" || description == "" || id == "") {
            return responseHandle(req, res, "Parameter Not Found", "product_cat", [], 500)
        }
        if (searchUser?.length > 0) {
            let editUser: any = await model.editData(
                name,
                description,
                id
            );
            return responseHandle(req, res, "Update Success", "product_cat", [], 200)
        } else {
            return responseHandle(req, res, "Name is already exist", "product_cat", [], 400)
        }
    } catch (err) {
        next(err)
    }
}

export const deleteData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id = req.params.id;
        let response: any = await model.deleteData(id);
        if (response) {
            responseHandle(req, res, "Update Success", "Delete", response, 200)
        }
    } catch (err) {
       next(err)
    }
}