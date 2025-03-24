const BaseError = require("../errors/base.error");
const userModel = require("../models/user.model");
const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
class AuthController {
  async register(req, res, next) {
    const { username, email, password } = req.body;
    try {
      const user = await authService.register(username, email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async activation(req, res, next) {
    const userId = req.params.id;
    try {
      await authService.activation(userId);
      return res.redirect("http://sammi.ac");
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const user = await authService.login(email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    const refreshToken = req.cookies.refreshToken; 
    try {
      const user = await authService.refresh(refreshToken);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const user = await authService.logout(req.cookies.refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const user = await authService.getUser(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
