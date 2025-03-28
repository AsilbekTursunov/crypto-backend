const UserDto = require("../dtos/user.dto");
const userModal = require("../models/user.model");
const bcrypt = require("bcryptjs");
const tokenService = require("./token.service");
const jwt = require("jsonwebtoken");
const tokenModal = require("../models/token.modal");
const BaseError = require("../errors/base.error");
class AuthService {
  async register(email, password) {
    const existingUser = await userModal.findOne({ email });

    if (existingUser) {
      throw BaseError.BadRequest("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await userModal.create({ 
      email,
      password: hashedPassword,
    });

    const userDto = new UserDto(response);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    });  
    return { user: userDto, ...tokens };
  }

  async activation(userId) {
    const response = await userModal.findByIdAndUpdate(
      userId,
      { isActivated: true },
      { new: true }
    );
    return response;
  }

  async login(email, password) {
    const user = await userModal.findOne({ email });

    if (!user) {
      throw BaseError.BadRequest("User not found");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw BaseError.BadRequest("Password mismatch");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    });

    return { user: userDto, ...tokens };
  }

  async refresh(refreshToken) { 
    console.log(refreshToken); 
    const userPaylod = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    console.log(userPaylod); 
    if (!userPaylod) {
      throw BaseError.BadRequest("Bad authorization");
    }
    const user = await userModal.findById(userPaylod.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    });

    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    await tokenModal.deleteOne({ user: user.id });
    return { user, message: "Logged out successfully" };
  }

  async getUser(id) {
    const user = await userModal.findById(id);
    if (!user) {
      throw BaseError.BadRequest("User not found");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    });

    return { user: userDto, ...tokens };
  }
}

module.exports = new AuthService();
