const multer = require("multer");
const storage = multer.diskStorage({});

const imageFileFilter = (req, file, cb) => {
  console.log(file);
  //If Upload file is NOT Image type
  if (!file.mimetype.startsWith("image")) {
    cb("Supported Only Image types !", false);
  }
  cb(null, true);
};

const videoFileFilter = (req, file, cb) => {
  console.log(file);
  //If Upload file is NOT Image type
  if (!file.mimetype.startsWith("video")) {
    cb("Supported Only Video types !", false);
  }
  cb(null, true);
};

//For Image Uplode
exports.uploadImage = multer({ storage, imageFileFilter });

//For Video Upload
exports.uploadVideo = multer({ storage, videoFileFilter });
