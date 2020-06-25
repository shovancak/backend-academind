const express = require("express");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the World",
    location: {
      lat: 40.74844474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((placeInDummyPlaces) => {
    return placeInDummyPlaces.id === placeId;
  });
  if (!place) {
    const error = new Error("Place with provided ID does not exist.");
    error.code = 404;
    throw error;
  }
  res.json({ place: place });
});

router.get("/user/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((placeInDummyPlaces) => {
    return placeInDummyPlaces.creator === userId;
  });
  if (!place) {
    const error = new Error("User with provided ID does not exist.");
    error.code = 404;
    return next(error);
  }
  res.json({ place: place });
});

module.exports = router;
