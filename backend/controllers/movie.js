const {
  sendError,
  formatActor,
  averageRatingPipeline,
  reletedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
} = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const Review = require("../models/review");
const { isValidObjectId, default: mongoose } = require("mongoose");

// ======================== For Admin Only ========================

exports.uploadTrailer = async (req, res) => {
  const { file } = req;
  if (!file) {
    return sendError(res, "Video file is missing");
  }
  const { secure_url: url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      resource_type: "video",
    }
  );

  res.status(201).json({ url, public_id });
};

exports.createMovie = async (req, res) => {
  const { file, body } = req;

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    //poster,
    trailer,
    language,
  } = body;

  console.log(req.body);

  console.log(typeof req.body.cast);
  console.log(typeof req.body.tags);
  console.log(typeof req.body.writers);
  console.log(typeof req.body.genres);
  console.log(typeof req.body.trailer);

  const newMovie = new Movie({
    title,
    storyLine,
    //director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    //writers,
    //poster,
    trailer,
    language,
  });

  if (director) {
    if (!isValidObjectId(director)) {
      return sendError(res, "Invalid Director id !");
    }
    newMovie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id !");
      }
    }
    newMovie.writers = writers;
  }

  //Uploading Poster
  /*
    multiple url of different sizes
    ex : '1280 * 720', '640 * 360', '320 * 180'
    ref : https://cloudinary.com/documentation/responsive_html
  */
  //Poster is optional field
  if (file) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });
    console.log(responsive_breakpoints[0].breakpoints);

    const finalPoster = {
      url,
      public_id,
      responsive: [],
    };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  await newMovie.save();
  res.status(201).json({ movie: { id: newMovie._id, title } });

  //res.status(201).json(newMovie);
};

exports.updateMoviewWithoutPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID !");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie not found !", 404);
  }

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director)) {
      return sendError(res, "Invalid Director id !");
    }
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id !");
      }
    }
    movie.writers = writers;
  }

  await movie.save();

  res.json({ message: "Movie is updated", movie });
};

exports.updateMoviewWithPoster = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID !");
  }

  if (!req.file) {
    return sendError(res, "Movie poster is missing ID !");
  }
  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie not found !", 404);
  }

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    trailer,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.trailer = trailer;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director)) {
      return sendError(res, "Invalid Director id !");
    }
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id !");
      }
    }
    movie.writers = writers;
  }

  await movie.save();

  //Update poster
  const posterId = movie.poster?.public_id;

  //Remove old poster and Update new
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") {
      return sendError(res, "Could not update poster at a moment !");
    }
  }

  //Upload new poster
  const {
    secure_url: url,
    public_id,
    responsive_breakpoints,
  } = await cloudinary.uploader.upload(req.file.path, {
    transformation: {
      width: 1280,
      height: 720,
    },
    responsive_breakpoints: {
      create_derived: true,
      max_width: 640,
      max_images: 3,
    },
  });
  console.log(responsive_breakpoints[0].breakpoints);

  const finalPoster = {
    url,
    public_id,
    responsive: [],
  };

  const { breakpoints } = responsive_breakpoints[0];
  if (breakpoints.length) {
    for (let imgObj of breakpoints) {
      const { secure_url } = imgObj;
      finalPoster.responsive.push(secure_url);
    }
  }

  movie.poster = finalPoster;

  await movie.save();
  res.json({ message: "Movie is updated", movie });
};

exports.removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID !");
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie not found !", 404);
  }

  //If there is poster or not
  const posterId = movie.poster?.public_id;

  //Remove poster
  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") {
      return sendError(res, "Could not remove poster from the cloud !");
    }
  }

  //If there is trailer or not
  const trailerId = movie.trailer?.public_id;

  if (!trailerId) {
    return sendError(res, "Could not find trailer in the cloud !");
  }

  if (trailerId) {
    const { result } = await cloudinary.uploader.destroy(trailerId);
    if (result !== "ok") {
      return sendError(res, "Could not remove trailer from the cloud !");
    }
  }

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed successfully !" });
};

exports.getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;
  const movies = await Movie.find({})
    .sort({
      createdAt: -1,
    })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  // movies.map((movie) => {
  //   return {
  //     id: movie._id,
  //     title: movie.title,
  //     poster: movie.poster?.url,
  //     genres: movie.genres,
  //     status: movie.status,
  //   };
  // });

  //Single line return
  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    responsivePosters: movie.poster?.responsive,
    genres: movie.genres,
    status: movie.status,
  }));
  res.json({ movies: results });
};

exports.getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Id is invalid !");
  }

  //Here we'are populate details of director wtiters and actor with help of their id and refPath passed in modal
  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );
  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      poster: movie.poster?.url,
      releseDate: movie.releseDate,
      status: movie.status,
      type: movie.type,
      language: movie.language,
      genres: movie.genres,
      tags: movie.tags,
      director: formatActor(movie.director),
      writers: movie.writers.map((w) => formatActor(w)),
      cast: movie.cast.map((c) => {
        return {
          id: c.id,
          profile: formatActor(c.actor),
          roleAs: c.roleAs,
          leadActor: c.leadActor,
        };
      }),
    },
  });
};

exports.updateMovie = async (req, res) => {
  const { movieId } = req.params;

  const { file } = req;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid Movie ID !");
  }

  // if (!req.file) {
  //   return sendError(res, "Movie poster is missing ID !");
  // }
  const movie = await Movie.findById(movieId);

  if (!movie) {
    return sendError(res, "Movie not found !", 404);
  }

  const {
    title,
    storyLine,
    director,
    releseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writers,
    language,
  } = req.body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releseDate = releseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director)) {
      return sendError(res, "Invalid Director id !");
    }
    movie.director = director;
  }

  if (writers) {
    for (let writerId of writers) {
      if (!isValidObjectId(writerId)) {
        return sendError(res, "Invalid writer id !");
      }
    }
    movie.writers = writers;
  }

  await movie.save();

  //Update poster if file attached with req
  if (file) {
    const posterId = movie.poster?.public_id;

    //Remove old poster and Update new
    if (posterId) {
      const { result } = await cloudinary.uploader.destroy(posterId);
      if (result !== "ok") {
        return sendError(res, "Could not update poster at a moment !");
      }
    }

    //Upload new poster
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(req.file.path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });
    console.log(responsive_breakpoints[0].breakpoints);

    const finalPoster = {
      url,
      public_id,
      responsive: [],
    };

    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }

    movie.poster = finalPoster;
  }

  await movie.save();
  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

exports.searchMovie = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) {
    return sendError(res, "Invalid Request !");
  }
  const movies = await Movie.find({ title: { $regex: title, $options: "i" } });
  res.json({
    results: movies.map((m) => {
      return {
        id: m._id,
        title: m.title,
        genres: m.genres,
        poster: m.poster?.url,
        status: m.status,
      };
    }),
  });
};

// ======================== For Normal Users ========================

exports.getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;
  //We only sent public movies to normal users
  const results = await Movie.find({ status: "public" })
    .sort("-createdAt")
    .limit(parseInt(limit));

  const movies = results.map((m) => {
    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      trailer: m.trailer?.url,
      storyLine: m.storyLine,
    };
  });

  res.json({ movies });
};

exports.getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  //Convert movieId(string) as valid ObjectId
  // mongoose.Types.ObjectId(movieId);

  if (!isValidObjectId(movieId)) {
    return sendError(res, "Movie Id is not valid!");
  }
  const movie = await Movie.findById(movieId).populate(
    "director writers cast.actor"
  );

  // //Aggregate pipeline only accepts id as objId not as string
  // const [aggregatedResponse] = await Review.aggregate(
  //   averageRatingPipeline(movie._id)
  // );

  // const reviews = {};

  // //If we have response, becasue movie have or hav not reviews
  // if (aggregatedResponse) {
  //   const { ratingAvg, reviewCount } = aggregatedResponse;
  //   reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
  //   reviews.reviewCount = reviewCount;
  // }

  const reviews = await getAverageRatings(movie._id);

  console.log(reviews);
  const {
    _id: id,
    title,
    storyLine,
    cast,
    writers,
    director,
    releseDate,
    genres,
    tags,
    language,
    poster,
    trailer,
    type,
  } = movie;
  res.json({
    movie: {
      id,
      title,
      storyLine,
      releseDate,
      genres,
      tags,
      language,
      type,
      poster: poster?.url,
      trailer: trailer?.url,
      cast: cast.map((c) => ({
        id: c._id,
        profile: {
          id: c.actor._id,
          name: c.actor.name,
          avatar: c.actor?.avatar?.url,
        },
        leadActor: c.leadActor,
        roleAs: c.roleAs,
      })),
      writers: writers.map((w) => ({
        id: w._id,
        name: w.name,
      })),
      director: {
        id: director._id,
        name: director.name,
      },
      reviews: { ...reviews },
    },
  });
};

exports.getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) {
    return sendError(res, "Invalid movie id!");
  }
  //We will find related movie with use of tags
  const movie = await Movie.findById(movieId);

  const movies = await Movie.aggregate(
    reletedMovieAggregation(movie.tags, movie._id)
  );

  //We use promise because we can't use await in map fuction
  const relatedMovies = await Promise.all(
    movies.map(async (m) => {
      const reviews = await getAverageRatings(m._id);
      return {
        id: m._id,
        title: m.title,
        poster: m.poster,
        responsivePosters: m.responsivePosters,
        reviews: { ...reviews },
      };
    })
  );
  res.json({ movies: relatedMovies });
};

exports.getTopRatedMovies = async (req, res) => {
  //Type is a optional field
  const { type = "Film" } = req.query;
  const movies = await Movie.aggregate(topRatedMoviesPipeline(type));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews: { ...reviews },
    };
  };
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};

exports.searchPublicMovie = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) {
    return sendError(res, "Invalid Request !");
  }

  //We only alllow use to search public movie
  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public",
  });
  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      reviews: { ...reviews },
    };
  };
  const results = await Promise.all(movies.map(mapMovies));
  res.json({ results });
};
