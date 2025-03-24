const express = require("express");
const authController = require("../controllers/user.controller");
const authmiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", authController.register);
router.get("/activation/:id", authController.activation);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/get-user", authmiddleware, authController.getUser);

module.exports = router;
