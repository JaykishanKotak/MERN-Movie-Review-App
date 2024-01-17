const crypto = require("crypto");
const cloudinary = require("../cloud");
const Review = require("../models/review");

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
  if (genres) {
    req.body.genres = JSON.parse(genres);
  }
  next();
};

//Mongodb aggregate pipeline To get average ratings
exports.averageRatingPipeline = (movieId) => {
  // Aggregation pipeline Flow -> Review => rating => parentMovieId => calculateAvg
  return [
    //Step 1 - Multiple opertaion to lookup Review records from a single database
    //It will match from Review table's local field id With forignField's id
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    //Setp 2 - Only Grab reviews of a parent movie which has same id as parentMovie in movie and movie id in Movie table
    {
      $match: { parentMovie: movieId },
    },
    //Step - 3 Gropu all of those data and peform average and counting operations
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewsCount: {
          $sum: 1,
        },
      },
    },
  ];
};

exports.reletedMovieAggregation = (tags, movieId) => {
  return [
    //find matching records according to tags
    {
      $lookup: {
        from: "Movie",
        localField: "tags",
        foreignField: "_id",
        as: "reletedMovies",
      },
    },
    //Find all movies records  matching with tags and not equle the same movie id
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    //add new data fields
    {
      $project: {
        // _id : 0,
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    //we need for only 5 records
    {
      $limit: 5,
    },
  ];
};

exports.getAverageRatings = async (movieId) => {
  //Aggregate pipeline only accepts id as objId not as string
  const [aggregatedResponse] = await Review.aggregate(
    this.averageRatingPipeline(movieId)
  );

  const reviews = {};

  //If we have response, becasue movie have or hav not reviews
  console.log(aggregatedResponse);
  if (aggregatedResponse) {
    const { ratingAvg, reviewsCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewsCount = reviewsCount;
  }
  return reviews;
};

exports.topRatedMoviesPipeline = (type) => {
  return [
    {
      $lookup: {
        from: "Movie",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    //Movie need to be have a review and it;s status equal to public, and we check same type of movies here
    {
      $match: {
        reviews: { $exists: true },
        status: { $eq: "public" },
        type: { $eq: type },
      },
    },
    //Create new data objecst with data and add review count
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: {
          $size: "$reviews",
        },
      },
    },
    //sort in decending order
    {
      $sort: {
        reviewCount: -1,
      },
    },
    //limit
    {
      $limit: 5,
    },
  ];
};
