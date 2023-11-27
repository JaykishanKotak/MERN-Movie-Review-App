const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB is Connected !");
  })
  .catch((err) => {
    () => {
      console.log("MongoDB Connection Failed :", err);
    };
  });
