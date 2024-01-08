const { sendError } = require("../utils/helper");
const cloudinary = require("../cloud");
const Movie = require("../models/movie");
const { isValidObjectId } = require("mongoose");

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
  res.status(201).json({ id: newMovie._id, title });

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
