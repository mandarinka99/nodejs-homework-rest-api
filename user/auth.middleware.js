const jwt = require("jsonwebtoken");
const User = require("./User");

async function autorize(req, res, next) {
  const autorizationHeader = req.get("Authorization");

  if (!autorizationHeader) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }

  const token = autorizationHeader.replace("Bearer ", "");

  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;
    console.log(`userId`, userId);

    const user = await User.findById(userId);

    console.log(`user`, user);

    if (!user) {
      return res.status(401).send({
        message: "Not authorized",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send(error);
  }
}

module.exports = {
  autorize,
};
