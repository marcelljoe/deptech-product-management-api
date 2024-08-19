import * as express from "express";
import * as prd_cat from "./product_category";

let router = express.Router();


router.route("/list").get(prd_cat.dataList);
router.route("/master").get(prd_cat.masterStyle);
router.route("/:id").get(prd_cat.categoryByid);
router.route("/saveCategory").post(prd_cat.insertData);
router.route("/edit").put(prd_cat.editData);
router.route("/deleted/:id").delete(prd_cat.deleteData);

export = router;
