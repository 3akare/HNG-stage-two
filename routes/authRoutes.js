const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/register", authController.register);
router.get("/login", authController.login);

module.exports = router;
