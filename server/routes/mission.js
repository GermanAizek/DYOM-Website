const router = require("express").Router();
let Mission = require("../models/Mission");
let User = require("../models/User");
const auth = require("../middleware/auth");
const { upload } = require("../upload");
const fs = require("fs");

// Get list of missions
router.get("/list", (req, res) => {
  const resultsPerPage = req.query.limit || 3;
  const page = req.query.page || 1;
  const regex = new RegExp(req.query.search, "i");
  const filter = req.query.search ? { title: { $regex: regex } } : {};

  Mission.find(filter)
    .select("title author updatedAt rating views downloads comments")
    .limit(resultsPerPage)
    .skip(resultsPerPage * (page - 1))
    .sort({ updatedAt: "desc" })
    .populate({
      path: "author",
      select: "username",
    })
    .exec((err, events) => {
      res.json(events);
    });
});

// Downlaod mission file
router.get("/download/:id", auth, (req, res) => {
  // ID of the audio as in the database
  const { id } = req.params;
  // Return the link
  Mission.findOne({ _id: id }).then((mission) => res.json(mission.missionFile));
});

// Add mission
router.post(
  "/add",
  auth,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  (req, res) => {
    let author = req.user.id;
    let file = null;
    let banner = null;
    let gallery = [];

    // Mission file vars
    if (req.files["file"]) {
      file = req.files["file"][0].originalname;
    }
    if (req.files["banner"]) {
      banner = req.files["banner"][0].originalname;
    }
    if (req.files["gallery"]) {
      for (var x = 0; x < req.files["gallery"].length; x++) {
        gallery.push(req.files["gallery"][x].originalname);
      }
    }
    let tags = req.body.tags.split(",");
    tags = tags.filter((empty) => empty !== "");

    // Mission params
    const {
      title,
      date,
      summary,
      description,
      trailer,
      credits,
      original,
      motto,
      music,
      difficulty,
      mods,
    } = req.body;

    // Required fields
    if (!title || !file) {
      return res
        .status(400)
        .json({ msg: "Please insert the required fields." });
    }

    // Limit tags and links ammount to a maximum of 3 tags
    if (tags.length > 3)
      return res.status(400).json({ msg: "No more than 3 tags are allowed!" });

    const newMission = new Mission({
      title,
      author,
      date,
      summary,
      description,
      banner,
      trailer,
      gallery,
      file,
      credits,
      tags,
      original,
      motto,
      music,
      difficulty,
      mods,
    });

    newMission
      .save()
      .then((mission) => {
        fs.rename(
          `./uploads/${author}/missions/uploading/`,
          `./uploads/${author}/missions/${mission._id}`,
          (err) => {
            if (err) console.log(err);
          }
        );
        // Add request to user database
        User.updateOne(
          { _id: author },
          {
            $push: { missions: mission._id },
          },
          (err, data) => {}
        );
        res.json({ msg: "Mission added into the database!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ msg: "Something went wrong. Try again later." });
      });
  }
);

module.exports = router;
