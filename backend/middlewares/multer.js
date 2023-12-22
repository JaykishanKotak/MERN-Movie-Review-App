const multer = require("multer");
const storage = multer.diskStorage({});

const fileFilter = (req, file, cb) => {
  console.log(file);
  //If Upload file is NOT Image type
  if (!file.mimetype.startsWith("image")) {
    cb("Supported Only Image types !", false);
  }
  cb(null, true);
};

//For Image Uplode
exports.uploadImage = multer({ storage, fileFilter });
