var express = require('express');
var router = express.Router();
var multer = require('multer');
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


router.post("/create", upload.single("uploadVideo"), makeThumbnail, function (req, res, next) {
    console.log(req.file);
    console.log(req.body);
    res.end();

});


module.exports = router;