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
  //   try {
  //     Post.insert(body).then((newPost) => {
  //       if (!body.title || !body.contents) {
  //         res
  //           .status(400)
  //           .json({ message: "Please provide title and contents for the post" });
  //       } else {
  //         res.status(201).json(newPost);
  //       }
  //     });
  //   } catch (e) {
  //     res
  //       .status(500)
  //       .json({ message: "The posts information could not be retrieved" });
  //   }

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
        res
          .status(500)
          .json({ message: "The posts information could not be retrieved" });
      });
  }
});

module.exports = router;
