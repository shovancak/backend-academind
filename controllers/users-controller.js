const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

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
const createNewUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      "Invalid inputs provided, please check your data.",
      422
    );
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });
  if (hasUser) {
    throw new HttpError("User with provided email address already exist.", 422);
  }

  const createdUser = {
    id: uuid(),
    name: name,
    email: email,
    password: password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => {
    return user.email === email;
  });

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User with provided credentials does not exist.", 401);
  }

  res.status(200).json({ message: "Logged in!" });
};

exports.getAllUsers = getAllUsers;
exports.createNewUser = createNewUser;
exports.loginUser = loginUser;
