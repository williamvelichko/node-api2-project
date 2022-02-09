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
  let { id } = req.params;

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
  let body = req.body;

  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert(body)
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((newPost) => {
        res.status(201).json(newPost);
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
  let body = req.body;
  let { id } = req.params;

  if (!body.title || !body.contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.findById(id)
      .then((stuff) => {
        if (stuff == null) {
          res.status(404).json({
            message: `The post with the specified ID ${id} does not exist`,
          });
        } else {
          return Post.update(id, body);
        }
      })
      .then((item) => {
        if (item) {
          return Post.findById(id);
        }
      })
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }

  //   let { id } = req.params;
  //   let body = req.body;

  //   try {
  //     const findPost = await Post.findById(id);
  //     if (findPost == null) {
  //       res.status(404).json({
  //         message: `The post with the specified ID ${id} does not exist`,
  //       });
  //       return;
  //     }
  //     if (!body.title || !body.contents) {
  //       res
  //         .status(400)
  //         .json({ message: "Please provide title and contents for the post" });
  //       return;
  //     } else {
  //       await Post.update(id, body);
  //       res.status(200).json(findPost);
  //     }
  //   } catch (e) {
  //     res
  //       .status(500)
  //       .json({ message: "The post information could not be modified" });
  //   }
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;

  //   Post.remove(id)
  //     .then(({ id }) => {
  //       let foundPost = Post.findById(id);
  //       if (foundPost == null) {
  //         res.status(404).json({
  //           message: `The post with the specified ID ${id} does not exist`,
  //         });
  //       } else {
  //         res.json(foundPost);
  //       }
  //     })
  // .then((post) => {
  //   //   if (post == null) {
  //   //     res.status(404).json({
  //   //       message: `The post with the specified ID ${id} does not exist`,
  //   //     });
  //   //     return;
  //   //   } else {
  //   res.json(post);
  //   //   }
  // })
  try {
    let foundPost = await Post.findById(id);
    if (foundPost == null) {
      res.status(404).json({
        message: `The post with the specified ID ${id} does not exist`,
      });
    } else {
      await Post.remove(id);
      res.json(foundPost);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "The post could not be removed" });
  }
});

router.get("/:id/comments", async (req, res) => {
  let { id } = req.params;
  try {
    let foundPost = await Post.findById(id);
    if (foundPost == null) {
      res.status(404).json({
        message: `The post with the specified ID ${id} does not exist`,
      });
    } else {
      const comment = await Post.findPostComments(id);
      res.json(comment);
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }

  //   try {
  //     let { id } = req.params;
  //     Post.findCommentById(id).then((comment) => {
  //       if (comment == null) {
  //         res.status(404).json({
  //           message: `The post with the specified ID ${id} does not exist`,
  //         });
  //       } else {
  //         res.json(comment);
  //       }
  //     });
  //   } catch (e) {
  //     res
  //       .status(500)
  //       .json({ message: "The comments information could not be retrieved" });
  //   }
});

module.exports = router;
