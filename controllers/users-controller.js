const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password"); // can be await User.find({}, "email name")
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not fetch users, please try again later",
      500
    );
    return next(error);
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const createNewUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs provided, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User with provided email already exist.", 422);
    return next(error);
  }

  const createdUser = new User({
    name: name,
    email: email,
    password: password,
    image:
      "https://image.shutterstock.com/image-photo/close-portrait-young-smiling-handsome-260nw-1180874596.jpg",
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Creating new user failed, please try again.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, please try again.", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, please try again.", 401);
    return next(error);
  }

  res.status(200).json({
    message: "Logged in!",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getAllUsers = getAllUsers;
exports.createNewUser = createNewUser;
exports.loginUser = loginUser;
