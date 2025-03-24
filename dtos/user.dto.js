module.exports = class UserDto { 
  email;
  id;
  isActivated;

  constructor(module) { 
    this.email = module.email;
    this.id = module._id;
    this.isActivated = module.isActivated;
  }
};
