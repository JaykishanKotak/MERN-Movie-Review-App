const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Buleprint to Create Users
const actorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    //Avatar is image which contains image url and unique public id of avatar image stored in cloud
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  }
);

//For Searching - here we creating index which will use for searching purposes
actorSchema.index({ name: "text" });

module.exports = mongoose.model("Actor", actorSchema);
