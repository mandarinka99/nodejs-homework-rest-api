const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  Types: { ObjectId },
} = require("mongoose");
const User = require("./User");

async function signUp(req, res) {
  try {
    const {
      body: { email, password },
    } = req;
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(409).send("Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 2);
    const user = await User.create({
      ...body,
      password: hashedPassword,
    });
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

module.exports = {
  login,
  signUp,
  logout,
  getCurrentUser,
};
