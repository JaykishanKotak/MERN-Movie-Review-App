const mongoose = require("mongoose");
const genres = require("../utils/genres");

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    //About movie
    storyLine: {
      type: String,
      trim: true,
      required: true,
    },
    //We are store all the cast as a Actor in database
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    releseDate: {
      type: Date,
      required: true,
    },
    //public for all users, private for Admin only
    status: {
      type: String,
      required: true,
      enum: ["public", "private"],
    },
    //Movie Type
    type: {
      type: String,
      required: true,
    },
    //Single movie can have multiple genres
    genres: {
      type: [String],
      required: true,
      enum: genres,
    },
    //For fetch similler movies
    tags: {
      type: [String],
      required: true,
    },
    //Single movie can have multiple casts
    cast: [
      {
        actor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Actor",
        },
        roleAs: { type: String },
        leadActor: { type: Boolean },
      },
    ],
    //Cast : [{ actor : objId("12345"), roleAs : "Ethen", leadActor : true }]
    //Single movie can have multiple writers
    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    poster: {
      type: Object,
      url: { tyype: String, required: true },
      public_id: { type: String, required: true },
      //To store responsive images
      responsive: [URL],
      // required: true,
    },
    //Video
    trailer: {
      type: Object,
      url: { tyype: String, required: true },
      public_id: { type: String, required: true },
      required: true,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    language: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
