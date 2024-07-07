const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/:userId", auth, userController.getUserDetails); //get

module.exports = router;
