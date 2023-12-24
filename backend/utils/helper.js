const crypto = require("crypto");
const cloudinary = require("../cloud");

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

exports.uploadImageToCloud = async (file) => {
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file,
    {
      gravity: "face",
      height: 500,
      width: 500,
      crop: "thumb",
    }
  );
  return { url, public_id };
};

exports.formatActor = (actor) => {
  const { name, about, gender, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar?.url,
  };
};

//To parse Array data
exports.parseData = (req, res, next) => {
  const { cast, tags, trailer, writers, genres } = req.body;

  if (trailer) {
    req.body.trailer = JSON.parse(trailer);
  }
  if (cast) {
    req.body.cast = JSON.parse(cast);
  }
  if (tags) {
    req.body.tags = JSON.parse(tags);
  }
  if (writers) {
    req.body.writers = JSON.parse(writers);
  }
  if (trailer) {
    req.body.genres = JSON.parse(genres);
  }
  next();
};
