const PostDto = require("../dtos/post.dto");
const UserDto = require("../dtos/user.dto");
const BaseError = require("../errors/base.error");
const postModel = require("../models/post.model");
const fileService = require("./file.service");

class PostService {
  async getAll() {
    const posts = await postModel.find()
    const postDto = posts.map((post) => new PostDto(post));
    return postDto;
  }

  async create(post, picture, authorId) {
    const file = fileService.save(picture);
    const response = await postModel.create({
      ...post,
      picture: file,
      author: authorId,
    });

    return response;
  }
  z;

  async delete(id) {
    if (!id) {
      return BaseError.BadRequest();
    }

    const response = await postModel.findByIdAndDelete(id);

    if (!response) {
      return BaseError.BadRequest();
    }
    return response;
  }

  async update(id, post) {
    if (!id) {
      throw BaseError.BadRequest("Identification key is required");
    }

    const response = await postModel.findByIdAndUpdate(id, post, {
      new: true,
    });

    if (!response) {
      throw BaseError.BadRequest(" Post id is invalid");
    }
    return response;
  }

  async findOne(id) {
    if (!id) {
      throw BaseError.BadRequest("Identification key is required");
    }

    const response = await postModel.findById(id);
    return response;
  }
}

module.exports = new PostService();
