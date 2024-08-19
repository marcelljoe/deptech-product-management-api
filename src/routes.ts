import * as express from "express";
const swaggerUi = require("swagger-ui-express");
import * as specs from "./config/swagger";
import verifyToken from "./middleware/verifyToken"

import authController from "./controllers/auth"
import transactionsController from "./controllers/transactions"
import usersController from "./controllers/users"
import productCategoryController from "./controllers/product_category"
import productController from "./controllers/product"

let router = express.Router();
router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs.specs, { explorer: true })
);

router.get("/", (req, res) => res.send(`WELCOME TO API ${process.env.NAME_PROGRAM}`))
router.use("/api/auth", verifyToken,authController)
router.use("/api/users", usersController)
router.use("/api/transactions", transactionsController)
router.use("/api/product_category", productCategoryController)
router.use("/api/product", productController)

export default router