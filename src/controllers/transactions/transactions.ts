import { NextFunction, Request, Response } from "express";
import * as model from "./model";
import { errorHandle, pagination, responseHandle, titleCase, validateRequestQuery } from '../../config/baseFunction';
let bcrypt = require("bcryptjs");
let salt = bcrypt.genSaltSync(10);

export const dataList = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/transactions/list`;
    const domainUrl = req.protocol + '://' + req.headers.host + "/"
    let result: any = {};

    const dataPerPage: number =
        validateRequestQuery(req.query.row, "num") == 0
            ? 10
            : validateRequestQuery(req.query.row, "num");

    const type: number = validateRequestQuery(req.query.type, "num")
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
        type: type
    };
    try {
        let countData: any = await model.countList(type);
        result.countData = countData.data;

        let totalData = countData[0].counts;
        let paginations: any = await pagination(page, dataPerPage, totalData);

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
                .filter((item: any) => item !== "id" && item !== 'category_id')
                .map((item: any, indx: any) =>
                  tabling.push({
                    key: indx,
                    title: titleCase(item),
                    dataIndex: item,
                    sorter: true,
                  })
                )
            : tabling.push({
                key: "2",
                title: "Description",
                dataIndex: "description",
                sorter: true,
              },{
                key: "3",
                title: "Trx Type",
                dataIndex: "type",
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

        return responseHandle(req, res, "success", "Product List", data, 200)
    } catch (error) {
        next(error)
    }
}

export const masterStyle = async (req: Request, res: Response, next: NextFunction) => {
    let apiUrl: string = `/api/product/list`;
    const domainUrl = req.protocol + '://' + req.headers.host + "/"
    let result: any = {};
    try {
        const dataList = await model.master()

        return responseHandle(req, res, "success", "Product Category List", dataList, 200)
    } catch (error) {
        next(error)
    }
}


export const productByid = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let id: number = validateRequestQuery(req.params.id, "num");
        const catById = await model.productByid(id)
        return responseHandle(req, res, "prodlist", "productById", catById, 200)
    } catch (error) {
        next(error)
    }
}

export const insertData = async (req: Request, res: Response, next: NextFunction) => {
    let description = validateRequestQuery(req.body.description, "char");
    let type = validateRequestQuery(req.body.type, 'num')
    let date_processed = req.body.date_processed
    let dataTable = req.body.dataTable
    
    try {
        await model.startTransaction()
        let response: any = await model.searchData(description, 0, "insert");
        if (description == "" || type == 0 || date_processed == "" || dataTable.length < 1) {
            errorHandle(req, res, "Data transaksi tidak lengkap.", "product", response, 500)
        }
        if (response?.length < 1) {
            let insertData: any = await model.insertData(
                description,
                type,
                date_processed
            );

            for(let x = 0; x < dataTable.length; x++) {
                let insertChilds: any = await model.insertChilds(
                    insertData.insertId,
                    dataTable[x].product_id,
                    dataTable[x].quantity 
                )
                if(type == 1) {
                    await model.plusQData(dataTable[x].quantity, dataTable[x].product_id)
                } else {
                    await model.minusQData(dataTable[x].quantity, dataTable[x].product_id)
                }
            }
            if (insertData.insertId != 0) {
                // berhasil
                responseHandle(req, res, "insert data success", "product", [], 200)
                await model.commitTransaction()
            } else {
                // gagal
                responseHandle(req, res, "Gagal insert", "product", [], 400)
            }
        } else {
            responseHandle(req, res, "Data already exist", "product", [], 400)
        }
    } catch (err) {
        await model.rollback()
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