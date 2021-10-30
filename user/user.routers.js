const { Router } = require("express");
const UserController = require("./user.controller");
const { validate } = require("../helpers/validate");
const {
  signUpSchema,
  loginSchema,
  updateSubscriptionSchema,
} = require("./user.schema");
const { autorize } = require("./auth.middleware");

const router = Router();

router.post("/signup", validate(signUpSchema), UserController.signUp);
router.post("/login", validate(loginSchema), UserController.login);
router.post("/logout", autorize, UserController.logout);
router.get("/current", autorize, UserController.getCurrentUser);
router.patch(
  "/",
  autorize,
  validate(updateSubscriptionSchema),
  UserController.updateUserSubscription
);

module.exports = router;
