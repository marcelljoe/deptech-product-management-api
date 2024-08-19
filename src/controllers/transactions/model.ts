import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    limitQuery: string;
    key: string;
    column: string;
    direction: string;
    type: number
}

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (A.description LIKE "%${key}%")`;
    }
};

const orderBy = (direction: string, column: string) => {
    const directionType =
        direction == "ASCEND" ? "ASC" : direction == "DESCEND" ? "DESC" : "";
    if (column == "" || directionType == "") {
        return " ORDER BY id DESC";
    } else {
        return ` ORDER BY ${column}  ${directionType}`;
    }
}

export const dataList = (params: Type) => {
    let listQuery = `SELECT A.id, A.date_processed, A.description, (CASE A.type WHEN 1 THEN 'Incoming' WHEN 2 THEN 'Outgoing' ELSE 'N/A' END) AS type FROM transactions A WHERE type = ${params.type} AND A.is_deleted = 0${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listQuery);
}

export const master = () => {
    let listQuery = "SELECT id AS `key`, id AS value, name AS label, 'product_id' AS name FROM product WHERE is_deleted = 0";

    return query(listQuery);
}

export const countList = (type: number) => {
    return query(`SELECT COUNT(*) AS counts FROM transactions where type = ${type} AND is_deleted = 0`)
}

export const productByid = (id: number) => {
    let queryById = `SELECT B.name AS label, A.quantity FROM transactions_det A join product B ON A.product_id = B.id WHERE A.trx_id = ?`;

    return query(queryById, id);
};

export const searchData = (name: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM transactions WHERE description=? AND id!=?`;
    let insert = `SELECT * FROM transactions WHERE description = ?`;
    if (type == "edit") {
        return query(edit, [name, id]);
    } else {
        return query(insert, name);
    }
};

export const insertData = (
    desc: string,
    type: number,
    date_processed: string,
) => {
    let queryInsert = `INSERT INTO transactions(description, type, date_processed) VALUES (?,?,?)`;
    return query(queryInsert, [desc, type, date_processed]);
};

export const insertChilds = (
    trxId: string,
    prdId: string,
    quantity: number,
) => {
    let queryInsert = `INSERT INTO transactions_det(trx_id, product_id, quantity) VALUES (?,?,?)`;
    return query(queryInsert, [trxId, prdId, quantity]);
};

export const plusQData = (
    quantity: number,
    id: number
) => {
    let editQuery = `UPDATE product SET quantity = quantity + ? WHERE id = ?`;

    return query(editQuery, [quantity, id]);
};

export const minusQData = (
    quantity: number,
    id: number
) => {
    let editQuery = `UPDATE product SET quantity = quantity - ? WHERE id = ?`;

    return query(editQuery, [quantity, id]);
};

export const deleteData = (id: string) => {
    let queryDelete = `UPDATE product SET is_deleted = 1 WHERE id = ?`;

    return query(queryDelete, [id]);
};

export const startTransaction = () => {
    return query("START TRANSACTION", [])
}

export const commitTransaction = () => {
    return query("COMMIT", [])
}

export const rollback = () => {
    return query("ROLLBACK", [])
}