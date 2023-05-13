var express = require('express');
var router = express.Router();
var multer = require('multer');
var db = require('../conf/database');
const { isLoggedIn } = require('../middleware/auth');

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
            var [insertResult, _ ] = await db.execute(
                `INSERT INTO posts (title, description, video, thumbnail,fk_userId) 
                VALUES (?,?,?,?,?);`,
                [Title, Description, path, thumbnail, userId]
            );
            if (insertResult && insertResult.affectedRows) {
                req.flash("success", "Your post has been created!");
                return req.session.save(function (error) {
                    if (error) next(error);
                    return res.redirect(`/`);
                })
            } else {
                next(new Error('Post could not be created'));
            }
        } catch (error) {
            next(error);
        }

    }

);


router.get('/:id(\\d+)', function(req,res){
    res.render('viewpost', { title: 'Posts', css:["form.css"]});
  })

router.get("/search", function(req,res,next){

});
router.delete("/delete", function(req,res,next){

});
module.exports = router;