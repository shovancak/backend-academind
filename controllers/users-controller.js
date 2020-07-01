const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Samuel Hovancak",
    email: "samuel@test.com",
    password: "testtest",
  },
];

const getAllUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

const createNewUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs provided, please check your data.", 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ emial: email });
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
    places: places,
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

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError("User with provided credentials does not exist.", 401)
    );
  }

  res.status(200).json({ message: "Logged in!" });
};

exports.getAllUsers = getAllUsers;
exports.createNewUser = createNewUser;
exports.loginUser = loginUser;
