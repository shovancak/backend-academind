const HttpError = require("../models/http-error");

const uuid = require("uuid/v4");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((placeInDummyPlaces) => {
    return placeInDummyPlaces.id === placeId;
  });
  if (!place) {
    throw new HttpError("Place with provided ID does not exist.", 404);
  }
  res.json({ place: place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((placeInDummyPlaces) => {
    return placeInDummyPlaces.creator === userId;
  });
  if (!place) {
    return next(new HttpError("User with provided ID does not exist.", 404));
  }
  res.json({ place: place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title: title,
    description: description,
    location: coordinates,
    address: address,
    creator: creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = {
    ...DUMMY_PLACES.find((placeInDummyPlaces) => {
      return placeInDummyPlaces.id === placeId;
    }),
  };
  const placeIndex = DUMMY_PLACES.findIndex((placeInDummyPlaces) => {
    return placeInDummyPlaces.id === placeId;
  });
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
