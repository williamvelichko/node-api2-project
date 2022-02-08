// implement your posts router here
const { Router, json } = require("express");

const Post = require("./posts-model");

const router = Router();

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/");

module.exports = router;
