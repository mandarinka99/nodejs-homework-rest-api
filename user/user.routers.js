const { Router } = require("express");
const UserController = require("./user.controller");
const { validate } = require("../helpers/validate");
const {
  signUpSchema,
  loginSchema,
  updateSubscriptionSchema,
  verifyUserSchema,
} = require("./user.schema");
const { autorize } = require("./auth.middleware");
const { upload } = require("../services/multer");
const { compressImage } = require("../services/compress");

const router = Router();

router.post(
  "/signup",
  upload.single("avatarURL"),
  compressImage,
  validate(signUpSchema),
  UserController.signUp
);
router.post("/login", validate(loginSchema), UserController.login);
router.post("/logout", autorize, UserController.logout);
router.get("/current", autorize, UserController.getCurrentUser);
router.patch(
  "/",
  autorize,
  validate(updateSubscriptionSchema),
  UserController.updateUserSubscription
);
router.patch(
  "/avatars",
  autorize,
  upload.single("avatarURL"),
  compressImage,
  UserController.updateUserAvatar
);
router.get("/verify/:verificationToken", UserController.verificationToken);

router.post(
  "/verify",
  validate(verifyUserSchema),
  UserController.sendRepeatedEmail
);

module.exports = router;
