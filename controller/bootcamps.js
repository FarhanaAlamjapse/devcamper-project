const Bootcamp = require("../models/Bootcamp");

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "show all bootcamps",
    Hello: req.hello,
  });
};

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `show single bootcamp${req.params.id}`,
  });
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `update bootcamp${req.params.id}`,
  });
};

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `delete bootcamp${req.params.id}`,
  });
};
