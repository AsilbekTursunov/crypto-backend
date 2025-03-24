module.exports = class PostDto {
  id;
  author;
  title;
  body;
  picture;
  createdAt;
  updatedAt;

  constructor(module) {
    this.author = module.author;
    this.id = module._id;
    this.title = module.title;
    this.body = module.body;
    this.picture = module.picture;
    this.updatedAt = module.updatedAt;
    this.createdAt = module.createdAt;
  }
};
