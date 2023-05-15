var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

router.get('/:postId(\\d+)/comments', async function (req, res) {
    try {
      var [rows, fields] = await db.execute(
        `SELECT c.id, c.createdAt, c.text, u.username FROM comments c
        JOIN users u ON c.fk_authorId = u.id
        WHERE fk_postId = ?
        ORDER BY createdAt DESC;`,
        [req.params.postId]
      );
      var comments = rows;
      res.render('comments', { title: "Comments", comments: comments });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  router.post("/:id", isLoggedIn, async function (req, res, next) {
  var postId = req.params.id;
  var comment = req.body.comment;
  var userId = req.session.user.userId;
  console.log(`postId: ${postId}, comment: ${comment}, userId: ${userId}`);

  try {
    var [result, _] = await db.execute(
      "INSERT INTO comments (text, fk_authorId, fk_postId) VALUES (?, ?, ?)",
      [comment, userId, postId]
    );
    if (result && result.affectedRows) {
      req.flash("success", "Your comment has been added!");
      return req.session.save(function (error) {
        if (error) next(error);
        return res.redirect(`/posts/${postId}`);
      });
    } else {
      next(new Error("Comment could not be added"));
    }
  } catch (error) {
    next(error);
  }
});


module.exports = router;