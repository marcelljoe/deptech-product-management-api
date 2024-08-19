import * as express from "express";
import * as users from "./users";

let router = express.Router();

router.route("/list").get(users.userList);
router.route("/:id").get(users.userByid);
router.route("/saveUser").post(users.insertUser);
router.route("/edit").put(users.editUser);
router.route("/deleted/:id").delete(users.deleteUser);

export = router;
