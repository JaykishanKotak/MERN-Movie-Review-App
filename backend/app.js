const express = require("express");

const cors = require("cors");

// const path = require("path");

//To use enviroment variables
require("dotenv").config();

//For Error handling from Front-end
require("express-async-errors");

const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");

//If not provide file name index.js will considerd as default file
require("./db");

const app = express();

//To Handel Cors Error
app.use(cors());

//To use JSON Data format
app.use(express.json());

//To Verify email with sendinblue, we need to give access to verify html inside public folder
// app.use(express.static(path.join(__dirname, "public")));

//Morgan to set the Dev environment
app.use(morgan("dev"));

//We are Using MVC - Modal View Control Pattern Here
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

// console.log(app);

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

//Handleing 404 Error using universal route
app.use("/*", handleNotFound);
//Error handling - Use it after route file or end of file
app.use(errorHandler);

//For Live
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Log When Server is Connect to the Port " + PORT);
  console.log("the Port is listining on the Port " + PORT);
});
