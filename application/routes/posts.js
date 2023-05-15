
var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');
const { getRecentPosts } = require('../middleware/posts');

const { makeThumbnail } = require('../middleware/posts');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos/uploads');
  },
  filename: function (req, file, cb) {

    var fileExt = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random
      () * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  },
});

const upload = multer({ storage: storage });


router.post("/create",
  isLoggedIn,
  upload.single("uploadVideo"),
  makeThumbnail,
  async function (req, res, next) {
    var { Title, Description } = req.body;
    var { path, thumbnail } = req.file;
    var { userId } = req.session.user;

    try {
      var [insertResult, _] = await db.execute(
        `INSERT INTO posts (title, description, video, thumbnail,fk_userId) 
                VALUES (?,?,?,?,?);`,
        [Title, Description, path, thumbnail, userId]
      );
      if (insertResult && insertResult.affectedRows) {
        var id = insertResult.insertId;
        req.flash("success", "Your post has been created!");
        return req.session.save(function (error) {
          if (error) next(error);
          return res.redirect(`/posts/${id}`);
        })
      } else {
        next(new Error('Post could not be created'));
      }
    } catch (error) {
      next(error);
    }

  }

);


router.get('/:id(\\d+)', isLoggedIn,async function (req, res) {

  try {
    var [rows, fields] = await db.execute(
      `SELECT id, title, description, video, thumbnail, createdAt FROM posts WHERE id = ?;`,
      [req.params.id]
    );
    var post = rows[0];
    if (!post) {
      req.flash("error", `Post not found`);
      req.session.save(function (err) {
        return res.redirect('/');
      });
    } else {
      res.render('viewpost', { title: post.title, post: post, css: ["form.css"], css: ["view-comment.css"] });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get('/search', async function(req, res, next) {
  var query = req.query.q;
  if (!query) {
      return res.redirect('/');
  }

  try {
      var [posts, fields] = await db.execute(
          `SELECT id, title, description, video, thumbnail FROM posts WHERE title LIKE ? OR description LIKE ?;`,
          [`%${query}%`, `%${query}%`]
      );
      if (posts.length === 0) {
          req.flash("error", `No posts found for "${query}"`);
          
      }
      res.render('', { title: 'Search results', posts: posts, css: ["thumbnailLink.css"], query: query });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
});

router.get('/postvideo', isLoggedIn, function(req, res){
  res.render('postvideo',{ title: 'Post Video', css:["form.css"] })
})

router.post('/delete/:id', async function(req, res, next) {
  const id = req.params.id;
  try {
    const [result, fields] = await db.execute(
      `DELETE FROM posts WHERE id = ?`,
      [id]
    );
    req.flash("success", `Post with ID ${id} has been deleted successfully!`);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;