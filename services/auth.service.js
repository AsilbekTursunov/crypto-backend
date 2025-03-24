const UserDto = require("../dtos/user.dto");
const userModal = require("../models/user.model");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const jwt = require("jsonwebtoken");
const tokenModal = require("../models/token.modal");
const BaseError = require("../errors/base.error");
const mailService = require("./mail.service");
class AuthService {
  async register(username, email, password) {
    const existingUser = await userModal.findOne({ email });

    if (existingUser) {
      throw BaseError.BadRequest("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await userModal.create({
      username,
      email,
      password: hashedPassword,
    });

    const userDto = new UserDto(response);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    }); 

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
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

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async refresh(refreshToken) {
    const userPaylod = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    const tokenVerifed = await tokenService.verifyRefreshToken(userPaylod.id);
    if (!userPaylod || !tokenVerifed) {
      throw BaseError.BadRequest("Bad authorization");
    }
    const user = await userModal.findById(userPaylod.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({
      email: userDto.email,
      id: userDto.id,
    });

    await tokenService.saveToken(user.id, tokens.refreshToken);
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
    return userDto;
  }
}

module.exports = new AuthService();
