const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register); //post
router.post("/login", authController.login); //post

module.exports = router;
