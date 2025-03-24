const BaseError = require("../errors/base.error");
const postService = require("../services/post.service");

class PostController {
  async getAll(req, res, next) {
    try {
      const allPosts = await postService.getAll();
      res.status(200).json(allPosts);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async create(req, res, next) {
    const { title, body } = req.body;
    if (!title || !body) {
      return BaseError.BadRequest("Title and body are required");
    }
    try {
      const newPost = await postService.create(
        req.body,
        req.files.picture,
        req.user.id // Assuming user object has an _id property for authorId
      );
      res.status(200).json(newPost);
    } catch (error) {
      console.log(error);

      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const deletedPost = await postService.delete(req.params.id);
      res.status(200).json(deletedPost);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) { 
    try {
      const updatedPost = await postService.update(req.params.id, req.body);
      res.status(200).json(updatedPost);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const post = await postService.findOne(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostController();
