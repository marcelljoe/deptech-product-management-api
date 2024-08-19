import { query } from "../../config/baseFunction"


export const login = (username: string) => {
    let queryLogin = `SELECT id, username, password FROM users WHERE username = ?`;

    return query(queryLogin, username);
};

export const detailUser = (id: number) => {
    let queryDetailUser = `SELECT users.id, username, firstname FROM users WHERE id = ?`;

    return query(queryDetailUser, id);
};