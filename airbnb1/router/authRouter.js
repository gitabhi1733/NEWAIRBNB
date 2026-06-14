const express = require('express')
const authRouter = express.Router();
const path = require("path");
const rootDir = require("../util/path-util");
const authController = require("../controllers/authController");

authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postlogin);
authRouter.post("/logout", authController.postlogout);
authRouter.get("/signup", authController.getSignup);
authRouter.post("/signup",authController.postSignup);

exports.authRouter = authRouter