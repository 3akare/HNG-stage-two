const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");

router.get("/:userId", userController.getUser); //get

module.exports = router;