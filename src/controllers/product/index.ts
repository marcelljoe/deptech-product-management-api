import * as express from "express";
import * as product from "./product";

let router = express.Router();

router.route("/list").get(product.dataList);
router.route("/master").get(product.masterStyle);
router.route("/:id").get(product.productByid);
router.route("/saveProduct").post(product.insertData);
router.route("/edit").put(product.editData);
router.route("/deleted/:id").delete(product.deleteData);

export = router;
