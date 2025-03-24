const express = require("express");
const postController = require("../controllers/post.controller");
const authorMiddleware = require("../middleware/author.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/get", postController.getAll);
router.post("/create", authMiddleware, postController.create);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorMiddleware,
  postController.delete
);
router.put(
  "/update/:id",
  authMiddleware,
  authorMiddleware,
  postController.update
);
router.get("/getone/:id", postController.getOne);
module.exports = router;
