const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const cloudinary = require("../cloud");
const {
  sendError,
  uploadImageToCloud,
  formatActor,
} = require("../utils/helper");

exports.createActor = async (req, res) => {
  //console.log(req.body);
  const { name, about, gender } = req.body;
  const { file } = req;
  //console.log("File", file);
  const newActor = new Actor({ name, about, gender });

  if (file) {
    // const { secure_url, public_id } = await cloudinary.uploader.upload(
    //   file.path,
    //   { gravity: "face", height: 500, width: 500, crop: "thumb" }
    // );
    const { url, public_id } = await uploadImageToCloud(file.path);
    //newActor.avatar = { url: secure_url, public_id };
    newActor.avatar = { url, public_id };
  }

  await newActor.save();
  res.status(201).json({ actor: formatActor(newActor) });

  // res.status(201).json({
  //   id: newActor._id,
  //   name,
  //   about,
  //   gender,
  //   avatar: newActor.avatar?.url,
  // });
};

exports.updateActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;
  if (!isValidObjectId(actorId)) {
    return sendError(res, "Invalid request !");
  }
  const actor = await Actor.findById(actorId);
  if (!actor) {
    return sendError(res, "Invalid request, Record not found !");
  }

  const public_id = actor.avatar?.public_id;

  //Remove old image if there is one
  if (public_id && file) {
    //Remove assets from cloud
    const { result } = await cloudinary.uploader.destroy(public_id);
    console.log("Delete", result);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud !");
    }
  }

  //Update new avatar if there is one
  if (file) {
    const { url, public_id } = await uploadImageToCloud(file.path);
    actor.avatar = { url, public_id };
  }
  actor.name = name;
  actor.about = about;
  actor.gender = gender;

  await actor.save();

  res.status(201).json({ actor: formatActor(actor) });
};

exports.removeActor = async (req, res) => {
  const { name, about, gender } = req.body;
  const { file } = req;
  const { actorId } = req.params;
  if (!isValidObjectId(actorId)) {
    return sendError(res, "Invalid request !");
  }
  const actor = await Actor.findById(actorId);
  if (!actor) {
    return sendError(res, "Invalid request, Record not found !");
  }

  const public_id = actor.avatar?.public_id;

  //Remove image
  if (public_id) {
    //Remove assets from cloud
    const { result } = await cloudinary.uploader.destroy(public_id);
    if (result !== "ok") {
      return sendError(res, "Could not remove image from cloud !");
    }
  }

  await Actor.findByIdAndDelete(actorId);

  res.json({ message: "Record removed, Successfully !" });
};

exports.searchActor = async (req, res) => {
  // const { query } = req;

  const { name } = req.query;
  /*
  For Exect search Results - > { $search: `"${query.name}"` }
  For Matching search Results -> { $search: query.name }
  */

  //Old Search Logic
  // const result = await Actor.find({ $text: { $search: `"${query.name}"` } });

  //options : "i" to ignore captial or small chars
  if (!name.trim()) {
    return sendError(res, "Invalid Request !");
  }
  const result = await Actor.find({
    name: { $regex: name, $options: "i" },
  });

  const actors = result.map((actor) => formatActor(actor));

  res.json({ results: actors });

  //res.json(result);
};

exports.getLatestActors = async (req, res) => {
  //Find & Sort latest record with Limit
  const result = await Actor.find()
    .sort({
      createdAt: -1,
    })
    .limit(12);

  const actors = result.map((actor) => formatActor(actor));

  res.json(actors);
};

exports.getSingleActor = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return sendError(res, "Invalid request !");
  }
  const actor = await Actor.findById(id);
  if (!actor) {
    return sendError(res, "Invalid request, Actor not found !", 404);
  }
  res.json(formatActor(actor));
};

exports.getActors = async (req, res) => {
  /*
  ============================ Pagination Logic ============================

    actorsInDb = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,........,97,98,99,100]
    newSelection = [1,2,3,,4,5]
    newSelectionNext = [6,7,8,9,10]

    pageNo = 0
    limit/ quantity = 5
    skip = pageNo * limiy = 0 * 5 = 0 Index skips 

    pageNo = 1
    limit/ quantity = 5
    skip = pageNo * limiy = 1 * 5 = 5 Index skips

    pageNo = 2
    limit/ quantity = 5
    skip = pageNo * limiy = 2 * 5 = 10 Index skips
  */

  //To avoide errors we're passing default valuse to paegNo and limit params
  const { pageNo = 0, limit = 20 } = req.query;

  /**
   Step 1 Find actor,
   Step 2 Sort Newly Created Actors,
   Step 3 Skip the previous records - if zero it skips zero iteams,
   Step 4 Select with Limit.
   */
  const actors = await Actor.find({})
    .sort({
      createdAt: -1,
    })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const profiles = actors.map((actor) => formatActor(actor));
  res.json({ profiles });
};
