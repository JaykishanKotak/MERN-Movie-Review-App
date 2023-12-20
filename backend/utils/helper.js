const crypto = require("crypto");

//Dynamic Error Return function
exports.sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

//Dynamic Genrate Reset Tokens
//Asyc await will not work with callback funcation, so we are using promise here.
exports.genrateRandomByte = () => {
  return new Promise((reslove, reject) => {
    //Genrate strong password reset token using crypto
    crypto.randomBytes(30, (err, buff) => {
      if (err) {
        console.log(err);
        //Code will not move from here
        reject(err);
      }
      const buffString = buff.toString("hex");
      console.log(buffString);
      reslove(buffString);
    });
  });
};

//Handleing 404 Error using universal route
exports.handleNotFound = (req, res) => {
  this.sendError(res, "Not Found", 404);
};
