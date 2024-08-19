import * as express from "express";
import * as users from "./auth";
import verifyToken from "../../middleware/verifyToken"

let router = express.Router();
/**
 * @swagger
 *
 * components:
 *  schemas:
 *      Login:
 *          type: object
 *          properties:
 *              username:
 *                  example: varchar
 *                  type: varchar
 *              password:
 *                  example: varchar
 *                  type: varchar
 */

/**
 * @swagger
 * /api/auth/login:
 *      post:
 *          tags:
 *              - Auth
 *          summary: Login
 *          produces:
 *              - application/json
 *          requestBody:
 *              description: Login
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Login'
 *          responses:
 *             200:
 *                  description: Login Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Login Success
 *                                  token:
 *                                      example: varchar
 *                                      type: varchar
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 *             401:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          "Username or Password Incorrect"
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 401
 *                                      type: varchar
 *                                  data:
 *                                      type: object
 */
router.route("/login").post(users.login);

/**
 * @swagger
 * /api/auth/user:
 *      get:
 *          tags:
 *              - Auth
 *          summary: detaile users
 *          security:
 *              - ApiKeyAuth: []
 *
 *          responses:
 *             200:
 *                  description: Succesful
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Success
 *                                  success:
 *                                      example: 1
 *                                      type: boolean
 *                                  status:
 *                                      example: 200
 *                                      type: string
 *                                  data:
 *                                      type: object
 *             422:
 *                  description: Invalid
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      example:
 *                                          Get Data Failed
 *                                  success:
 *                                      example: 0
 *                                      type: boolean
 *                                  status:
 *                                      example: 422
 *                                      type: string
 *                                  data:
 *                                      type: object
 */
router.route("/user").get(verifyToken, users.detailUser);

export = router;
