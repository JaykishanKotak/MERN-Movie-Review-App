const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/helper");
const User = require("../models/user");

exports.isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) return sendError(res, "Invalid Token");

  const jwtToken = token.split("Bearer ")[1];
  console.log(jwtToken);
  if (!jwtToken) return sendError(res, "Invalid Token");
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  const { userId } = decode;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid token, User not found !", 404);

  //   res.json({ user: { id: user._id, name: user.name, email: user.email } });

  //If all things were correct add user  deails into add req -> it can acceess by req.user
  req.user = user;
  next();
  // console.log(jwtRes);
  // res.json(jwtRes);
};

exports.isAdmin = async (req, res, next) => {
  //Find out user is admin or not

  //Check is user is loggedin or not
  const { user } = req;
  if (user.role !== "admin") {
    return sendError(res, "Unauthorized access !");
  }
  next();
};
