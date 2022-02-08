// implement your posts router here
const { Router, json } = require("express");

const Post = require("./posts-model");

const router = Router();

router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    Post.findById(id).then((post) => {
      if (post == null) {
        res.status(404).json({
          message: `The post with the specified ID ${id} does not exist`,
        });
      } else {
        res.json(post);
      }
    });
  } catch (e) {
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.post("/", (req, res) => {
  const body = req.body;

  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert(body)
      .then((newPost) => {
        res.status(200).json(newPost);
      })

      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  try {
    const findPost = Post.findById(id);
    if (findPost == null) {
      res.status(404).json({
        message: `The post with the specified ID ${id} does not exist`,
      });
      return;
    }
    if (!body.title || !body.contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
      return;
    } else {
      let updatedPost = await Post.update(id, body);
      res.status(200).json(updatedPost);
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Post.remove(id)
    .then((post) => {
      if (post == null) {
        res.status(404).json({
          message: `The post with the specified ID ${id} does not exist`,
        });
      } else {
        res.json(post);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "The post could not be removed" });
    });
});
module.exports = router;
