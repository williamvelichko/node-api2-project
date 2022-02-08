// implement your posts router here
const { Router } = require("express");

const Post = require("./posts-model");

const router = Router();

router.get("/", (req, res) => {
  console.log("router working");
});

module.exports = router;
