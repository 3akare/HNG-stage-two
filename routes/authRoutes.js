const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/register", authController.register); //post
router.get("/login", authController.login); //post

module.exports = router;
