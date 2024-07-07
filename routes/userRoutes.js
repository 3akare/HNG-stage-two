const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUserDetails); //get

module.exports = router;
