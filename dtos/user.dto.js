module.exports = class UserDto {
  username;
  email;
  id;
  isActivated;

  constructor(module) {
    this.username = module.username;
    this.email = module.email;
    this.id = module._id;
    this.isActivated = module.isActivated;
  }
};
