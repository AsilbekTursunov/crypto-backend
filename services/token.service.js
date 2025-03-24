const jwt = require("jsonwebtoken");
const tokenModal = require("../models/token.modal");

class TokenService {
  generateToken(user) {
    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const existToken = await tokenModal.findOne({ user: userId });

    if (existToken) {
      existToken.refreshToken = refreshToken;
      return existToken.save();
    }
    const newToken = await tokenModal.create({ user: userId, refreshToken });
    return newToken;
  }
  async verifyRefreshToken(id) {
    return await tokenModal.findOne({ user: id });
  }
}

module.exports = new TokenService();
