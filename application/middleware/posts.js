var pathToFFMPEG = require('ffmpeg-static');
var exec = require('child_process').exec; 

module.exports = {
    makeThumbnail: function (req, res, next) {
        if (!req.file) {
            next(new Error("File upload failed"));
        } else {
            try {
                var destinationOfThumbnail = `public/images/uploads/thumbnail-${
                    req.file.filename.split(".")[0]
                }.png`;
                var thumbnailCommand = `${pathToFFMPEG} -ss 00:00:01 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
                exec(thumbnailCommand);
                req.file.thumbnail = destinationOfThumbnail;
                next();
            } catch (error) {
                next(error);
            }
        }
    },




   getPostsForUserBy: async function (req, res, next) {
        try {
            var [rows, fields] = await db.execute(
                `SELECT id, title, description, video, thumbnail, createdAt FROM posts WHERE fk_userId = ? ORDER BY createdAt DESC;`,
                [req.params.userId]
            );
            res.locals.posts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getPostById: async function (req, res, next) {
        try {
            var [rows, fields] = await db.execute(
                `SELECT id, title, description, video, thumbnail, createdAt FROM posts WHERE id = ?;`,
                [req.params.id]
            );
            res.locals.currentPost = rows[0];
            next();
        } catch (error) {
            next(error);
        }
    },
    getCommentsForPostById: async function (req, res, next) {
        try {
            var [rows, fields] = await db.execute(
                `SELECT id, text, createdAt FROM comments WHERE fk_postId = ? ORDER BY createdAt DESC;`,
                [req.params.id]
            );
            res.locals.currentPost.comments = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
    getRecentPosts: async function (req, res, next) {
        try {
            var [rows, fields] = await db.execute(
                `SELECT id, title, description, video, thumbnail, createdAt FROM posts ORDER BY createdAt DESC LIMIT 10;`,
            );
            res.locals.recentPosts = rows;
            next();
        } catch (error) {
            next(error);
        }
    },
};
