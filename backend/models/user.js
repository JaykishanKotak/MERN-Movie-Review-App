const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Buleprint to Create Users
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  {
    timestamps: true,
  }
);

//Hash Password before save in into DB
//Run this func pre(before) save in db
userSchema.pre("save", async function (next) {
  //Run when the document is modified
  if (this.isModified("password")) {
    //Arrow function works differnlty with this keyword
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

//Compare Password
userSchema.methods.comparePassword = async function (password) {
  //Compare result password with password stored in db
  const result = await bcrypt.compare(password, this.password);
  return result;
};

//Export Schema
module.exports = mongoose.model("User", userSchema);
