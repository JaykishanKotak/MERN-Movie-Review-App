const express = require("express");

const cors = require("cors");

//For Error handling from Front-end
require("express-async-errors");

const userRouter = require("./routes/user");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const { handleNotFound } = require("./utils/helper");

//To use enviroment variables
require("dotenv").config();

//If not provide file name index.js will considerd as default file
require("./db");

const app = express();

//To Handel Cors Error
app.use(cors());

//To use JSON Data format
app.use(express.json());

//Morgan to set the Dev environment
app.use(morgan("dev"));

//We are Using MVC - Modal View Control Pattern Here

// console.log(app);

app.use("/api/user", userRouter);

//Handleing 404 Error using universal route
app.use("/*", handleNotFound);
//Error handling - Use it after route file or end of file
app.use(errorHandler);

app.listen(8000, () => {
  console.log("Log When Server is Connect to the Port 8000");
  console.log("the Port is listining on the Port 8000");
});
