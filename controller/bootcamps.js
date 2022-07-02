const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ["select", "sort"];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(req.query);

  // create operators ($lt,lte,gte etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  }

  // executing query
  const bootcamps = await query;

  res.status(200).json({ success: true, data: bootcamps });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return;
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
    // return res.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    //return res.status(400).json({ successs: false });
    return;
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return;
    new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404);
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// desc           Get bootcamps within a radius
// route          GET/api/v1/bootcamps/radius/:zipcode/:distance
// access         Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // divide dist by radius by Earth;
  // Earth Radius=3,963 mi/6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
