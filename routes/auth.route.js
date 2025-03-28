const express = require("express");
const authController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/register", authController.register);
router.get("/activation/:id", authController.activation);
router.post("/login", authController.login);
router.get("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/get-user", authMiddleware, authController.getUser);

module.exports = router;
