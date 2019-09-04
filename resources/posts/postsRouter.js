const express = require("express");
const db = require("../../data/db");
const router = express.Router();
//const postsController = require("./postsController");

// create a post
router.post("/posts", async (req, res) => {
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      error: true,
      message: "Please provide title and contents for the post."
    });
  }
  try {
    const post = await db.insert(req.body);
    const newPost = await db.findById(post.id);
    res.status(201).json({ error: false, post: newPost });
  } catch (errors) {
    res.status(500).json({
      error: true,
      message: "There was an error while saving the post to the database"
    });
  }
});

// get all posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await db.find();
    res.json({ error: false, posts: posts });
  } catch (errors) {
    res.status(500).json({
      error: true,
      message: "The posts information could not be retrieved."
    });
  }
});
// update a post
router.put("/posts/:id", async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .json({ error: true, message: "Please provide the id of the post." });
  }
  if (!req.body.title || !req.body.contents) {
    res.status(400).json({
      error: true,
      message: "Please provide a title and a new content for the blog post."
    });
  }
  try {
    const row = await db.update(req.params.id, req.body);
    if (row === 1) {
      const updatedPost = await db.findById(req.params.id);
      res.status(200).json({ error: false, post: updatedPost });
    } else {
      res.status(404).json({
        error: true,
        message: "The post with the specified ID does not exist."
      });
    }
  } catch (errors) {
    res.status(500).json({
      error: true,
      message: "The post information could not be modified."
    });
  }
});
// remove a post
router.delete("/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const row = await db.remove(id);

    if (row === 1) {
      res
        .status(200)
        .json({ error: false, message: "The post has been removed" });
    } else {
      res.status(404).json({
        error: true,
        message: "The post with the specified ID does not exist."
      });
    }
  } catch (errors) {
    res
      .status(500)
      .json({ error: true, message: "The post could not be removed." });
  }
});
// create a comment to an existing post
router.post("/posts/:id/comments", async (req, res) => {
  if (!req.body.text) {
    res
      .status(400)
      .json({ error: true, message: "Please provide text for the comment." });
  }
  try {
    const post = await db.findById(req.params.id);
    if (post.length === 0) {
      res.status(404).json({
        error: true,
        message: "The post with the specified ID does not exist."
      });
    } else {
      const comment = await db.insertComment({
        post_id: req.params.id,
        text: req.body.text
      });

      const newComment = await db.findCommentById(comment.id);
      res.status(201).json({ error: false, comment: newComment });
    }
  } catch (errors) {
    res.status(500).json({
      error: true,
      message: "There was an error while saving the comment to the database"
    });
  }
});
// get all comments by a post's id
router.get("/posts/:id/comments", async (req, res) => {
  try {
    const post = await db.findById(req.params.id);

    if (post.length === 0) {
      res.status(404).json({
        error: true,
        message: "The post with the specified ID does not exist."
      });
    } else {
      const comments = await db.findCommentById(req.params.id);

      if (comments.length > 0) {
        res.status(200).json({ error: false, comments: comments });
      } else {
        res
          .status(200)
          .json({ error: false, message: "There are no comments" });
      }
    }
  } catch (errors) {
    res.status(500).json({
      error: true,
      message: "The comments information could not be retrieved."
    });
  }
});
module.exports = router;
