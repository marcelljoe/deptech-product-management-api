import { connection } from '../../config/db';
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

interface Type {
    limitQuery: string;
    key: string;
    column: string;
    direction: string;
}

const keyWhere = (key: string) => {
    if (key == "") {
        return "";
    } else {
        return ` AND (name LIKE "%${key}%" OR description LIKE "%${key}%")`;
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
    let listQuery = `SELECT id, name, description FROM product_category WHERE is_deleted = 0${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listQuery);
}

export const master = () => {
    let listQuery = "SELECT id AS `key`, id AS value, name AS label, 'category_id' AS name FROM product_category WHERE is_deleted = 0";

    return query(listQuery);
}

export const countList = () => {
    return query("SELECT COUNT(*) AS counts FROM product_category where is_deleted = 0")
}

export const categoryByid = (id: number) => {
    let queryById = `SELECT * FROM product_category WHERE id = ?`;

    return query(queryById, id);
};

export const searchData = (name: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM product_category WHERE name=? AND id!=?`;
    let insert = `SELECT * FROM product_category WHERE name= ?`;
    if (type == "edit") {
        return query(edit, [name, id]);
    } else {
        return query(insert, name);
    }
};

export const insertData = (
    name: string,
    desc: string
) => {
    let queryInsert = `INSERT INTO product_category(name, description) VALUES (?,?)`;
    return query(queryInsert, [name, desc]);
};

export const editData = (
    name: string,
    desc: string,
    id: number
) => {
    let editQuery = `UPDATE product_category SET name = ?, description = ? WHERE id = ?`;

    return query(editQuery, [name, desc, id]);
};

export const deleteData = (id: string) => {
    let queryDelete = `UPDATE product_category SET is_deleted = 1 WHERE id = ?`;

    return query(queryDelete, [id]);
};