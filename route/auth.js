const express = require("express");
const router = express.Router();
const {valToken} = require("../middleware/auth");
const controller = require('../controller/auth');//Requring Controllers
// ex---> auth/register
router.post("/register", controller.register);
router.get("/getallusers",controller.allusers);
router.get("/getallusers/:id",controller.allusersById);
router.post("/login", controller.login);
router.post("/updateuser/:id",controller.updateUser);
router.post("/deluser",controller.deleteUser);
router.get("/logout", controller.logout);
module.exports = router
