const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const {
  Types: { ObjectId },
} = require("mongoose");
const dotenv = require("dotenv");
const User = require("./User");
const { sendVerificationEmail } = require("../services/emaling");

async function signUp(req, res) {
  try {
    const { body } = req;
    const foundUser = await User.findOne({ email: body.email });
    if (foundUser) {
      return res.status(409).send("Email in use");
    }

    const hashedPassword = await bcrypt.hash(body.password, 2);
    const user = await User.create({
      ...body,
      password: hashedPassword,
      avatarURL: req.file.fileName,
      verifyToken: uuidv4(),
    });
    await sendVerificationEmail(user.email, user.verifyToken);
    res.json(user);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function login(req, res) {
  const {
    body: { email, password },
  } = req;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(401).send("Email or password is wrong");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send("Email or password is wrong");
  }

  if (!user.verify) {
    return res.status(401).send("User is not verified");
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );
  await User.findByIdAndUpdate(user._id, { token });
  return res.json({ token, user });
}

async function logout(req, res) {
  try {
    const currentUser = req.user;
    await User.findByIdAndUpdate(currentUser._id, { token: null });
    return res.status(204).send("No Content");
  } catch (error) {
    res.status(400).send(error);
  }
}

async function getCurrentUser(req, res) {
  try {
    const currentUser = req.user;
    return res.status(200).send({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateUserSubscription(req, res) {
  try {
    const {
      user: { _id },
      body,
    } = req;

    const constUpdatedSubscription = await User.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return res.status(200).send(constUpdatedSubscription);
  } catch (error) {
    res.status(400).send(error);
  }
}

async function updateUserAvatar(req, res) {
  try {
    const {
      user: { _id },
      file,
    } = req;

    if (!file) {
      return res.status(401).send("Avatar is required");
    }

    const body = { avatarURL: file.filename };

    await User.findByIdAndUpdate(_id, body, {
      new: true,
    });
    return res.status(200).send({ avatarURL: file.filename });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function verificationToken(req, res) {
  try {
    const user = await User.findOne(req.params);

    if (!user) {
      return res.status(404).send("User not found");
    }

    await User.findByIdAndUpdate(user._id, {
      verifyToken: null,
      verify: true,
    });

    return res.status(200).send("Verification successful");
  } catch (error) {
    res.status(400).send(error);
  }
}

async function sendRepeatedEmail(req, res) {
  try {
    const user = await User.findOne(req.email);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.verify) {
      return res.status(404).send("Verification has already been passed");
    }

    await sendVerificationEmail(user.email, user.verifyToken);

    return res.status(200).send("Verification email sent");
  } catch (error) {
    res.status(400).send(error);
  }
}

module.exports = {
  login,
  signUp,
  logout,
  getCurrentUser,
  updateUserSubscription,
  updateUserAvatar,
  verificationToken,
  sendRepeatedEmail,
};
