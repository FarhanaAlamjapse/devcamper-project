const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
// const logger = require("./middleware/logger");
const morgan = require("morgan");

//load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

const app = express();

//Body parser
app.use(express.json());

// app.use(logger);

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//mouth router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV}mode on port ${PORT}`)
);

//Handle unhandle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`);
});
