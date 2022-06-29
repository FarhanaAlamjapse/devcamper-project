//desc       GET all bootcamps
//route      GET/api/v1/bootcamps
//access     public

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "Get all bootcamps",
  });
};
//desc       GET all bootcamps
//route      GET/api/v1/bootcamps
//access     public

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `get single bootcamp ${req.params.id}`,
  });
};

//desc       create new bootcamps
//route      POST/api/v1/bootcamps
//access     public

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "create new bootcamps",
  });
};

//desc       Update  bootcamps
//route      PUT/api/v1/bootcamps/:id
//access     private

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `update bootcamp${req.params.id}`,
  });
};

//desc       delete  bootcamp
//route      DELETE/api/v1/bootcamps/:id
//access     private

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `delete bootcamp ${req.params.id}`,
  });
};
