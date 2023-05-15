var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

router.get('/:postId(\\d+)', async function (req, res) {
  try {
    const [rows, fields] = await db.execute(
      `SELECT c.id, c.createdAt, c.text, u.username FROM comments c
      JOIN users u ON c.fk_authorId = u.id
      WHERE fk_postId = ?
      ORDER BY createdAt DESC;`,
      [req.params.postId]
    );
    const comments = rows;
    res.render('comments', { title: "Comments", comments: comments });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/:postId", isLoggedIn, async function (req, res, next) {
  const postId = req.params.postId;
  const { comment } = req.body;
  const userId = req.session.user.userId;

  try {
    const [result, _] = await db.execute(
      "INSERT INTO comments (text, fk_authorId, fk_postId) VALUES (?, ?, ?)",
      [comment, userId, postId]
    );
    if (result && result.affectedRows) {
      req.flash("success", "Your comment has been added!");
      req.session.save((error) => {
        if (error) next(error);
        res.redirect(`/posts/${postId}`);
      });
    } else {
      next(new Error("Comment could not be added"));
    }
  } catch (error) {
    next(error);
  }
});


  


module.exports = router;