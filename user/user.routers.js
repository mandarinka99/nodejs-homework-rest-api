const { Router } = require("express");
const UserController = require("./user.controller");
const { validate } = require("../helpers/validate");
const { signUpSchema, loginSchema } = require("./user.schema");
const { autorize } = require("./auth.middleware");

const router = Router();

router.post("/signup", validate(signUpSchema), UserController.signUp);
router.post("/login", validate(loginSchema), UserController.login);
router.post("/logout", autorize, UserController.logout);
router.get("/current", autorize, UserController.getCurrentUser);

module.exports = router;
