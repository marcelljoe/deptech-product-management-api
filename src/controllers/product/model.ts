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
        return ` AND (A.name LIKE "%${key}%" OR A.description LIKE "%${key}%")`;
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
    let listQuery = `SELECT A.id, A.category_id, A.name, A.description, A.picture, B.name AS category, A.quantity FROM product A JOIN product_category B ON A.category_id = B.id WHERE A.is_deleted = 0${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listQuery);
}

export const master = () => {
    let listQuery = "SELECT id AS `key`, id AS value, name AS label, 'product_id' AS name, quantity FROM product WHERE is_deleted = 0";

    return query(listQuery);
}

export const countList = () => {
    return query("SELECT COUNT(*) AS counts FROM product where is_deleted = 0")
}

export const productByid = (id: number) => {
    let queryById = `SELECT * FROM product WHERE id = ?`;

    return query(queryById, id);
};

export const searchData = (name: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM product WHERE name=? AND id!=?`;
    let insert = `SELECT * FROM product WHERE name= ?`;
    if (type == "edit") {
        return query(edit, [name, id]);
    } else {
        return query(insert, name);
    }
};

export const insertData = (
    name: string,
    desc: string,
    picture: string,
    category: number
) => {
    let queryInsert = `INSERT INTO product(name, description, picture, category_id) VALUES (?,?,?,?)`;
    return query(queryInsert, [name, desc, picture, category]);
};

export const editData = (
    name: string,
    desc: string,
    picture: string,
    category: number,
    id: number
) => {
    let editQuery = `UPDATE product SET name = ?, description = ?, picture = ?, category_id = ? WHERE id = ?`;

    return query(editQuery, [name, desc, picture, category, id]);
};

export const deleteData = (id: string) => {
    let queryDelete = `UPDATE product SET is_deleted = 1 WHERE id = ?`;

    return query(queryDelete, [id]);
};