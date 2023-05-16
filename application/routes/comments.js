var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

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