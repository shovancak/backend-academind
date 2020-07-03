const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRouters = require("./routes/users-routes");
const placesRoutes = require("./routes/places-routes");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRouters);
app.use("/api/places", placesRoutes);

app.use((req, res, next) => {
  const error = new HttpError("This page does not exist.", 404);
  throw error;
});

// error handling function
app.use((error, req, res, nest) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred." });
});

mongoose
  .connect(
    "mongodb+srv://samuel:83461834Sh@cluster0-eamri.mongodb.net/mern-academind?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

console.log("Server is running.");
