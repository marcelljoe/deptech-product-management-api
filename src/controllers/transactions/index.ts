import * as express from "express";
import * as transactions from "./transactions";

let router = express.Router();

router.route("/list").get(transactions.dataList);
router.route("/master").get(transactions.masterStyle);
router.route("/:id").get(transactions.productByid);
router.route("/saveTransaction").post(transactions.insertData);
router.route("/deleted/:id").delete(transactions.deleteData);

export = router;
