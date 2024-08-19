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
        return ` AND (username LIKE "%${key}%" OR firstname LIKE "%${key}%" OR lastname LIKE "%${key}%" OR email LIKE "%${key}%")`;
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

export const userList = (params: Type, url: string) => {
    let listEntriesQuery = `SELECT id, username, firstname, lastname, email, birthdate, gender FROM users WHERE is_deleted = 0${keyWhere(params.key)}${orderBy(params.direction, params.column)} ${params.limitQuery}`;

    return query(listEntriesQuery, url);
}

export const countUsers = () => {
    return query("SELECT COUNT(*) AS counts FROM users where is_deleted = 0")
}

export const userByid = (id: number) => {
    let queryUserbyId = `SELECT * FROM users WHERE users.id = ?`;

    return query(queryUserbyId, id);
};

export const searchUser = (username: string, id: number, type: string) => {
    let edit = `SELECT COUNT(*) AS counts FROM users WHERE username=? AND id!=?`;
    let insert = `SELECT * FROM users WHERE username= ?`;
    if (type == "edit") {
        return query(edit, [username, id]);
    } else {
        return query(insert, username);
    }
};

export const insertUser = (
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: string,
    gender: string,
    password: string
) => {
    let queryInsert = `INSERT INTO users(username, firstname, lastname, email, birthdate, gender, password) VALUES (?,?,?,?,?,?,?)`;
    return query(queryInsert, [username, firstname, lastname, email, birthdate, gender, password]);
};

export const editUser = (
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    birthdate: string,
    gender: string,
    password: string,
    id: number
) => {
    let editUserQuery = `UPDATE users SET username = ?, firstname = ?, lastname = ?, email = ?,  birthdate = ?, gender = ?, password = ? WHERE id = ?`;

    return query(editUserQuery, [username, firstname, lastname, email, birthdate, gender, password, id]);
};

export const deleteUser = (id: string) => {
    let queryDelete = `UPDATE users SET is_deleted = 1 WHERE id = ?`;

    return query(queryDelete, [id]);
};