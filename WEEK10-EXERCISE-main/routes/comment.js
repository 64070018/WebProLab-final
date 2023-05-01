const express = require("express");
const pool = require("../config");
const path = require("path");

const router = express.Router();

// Get comment
router.get('/:blogId/comments', function (req, res, next) {

});




// Require multer for file upload
const multer = require('multer')
// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './static/uploads')
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })


// Create new comment
router.post('/:blogId/comments', upload.single('image_comment'), async function (req, res, next) {
    const file = req.file;

    const content = req.body.comment;
    const blogId = req.params.blogId

    // req.file.path.substr(6)


    const conn = await pool.getConnection()
    // Begin transaction
    await conn.beginTransaction();

    try {
        if (!file) {
            // const error = new Error("Please upload a file");
            // error.httpStatusCode = 400;
            // return next(error);
            var imageComment = 'https://bulma.io/images/placeholders/128x128.png';
        } else {
            var imageComment = "/uploads/" + req.file.filename
        }

        const result = await conn.query(
            "INSERT INTO comments(blog_id, comment) VALUES(?, ?);",
            [blogId, content])

        const commentId = result[0].insertId;

        await conn.query(
            "INSERT INTO images(blog_id, comment_id, file_path) VALUES(?, ?, ?);",
            [blogId, commentId, imageComment])
        await conn.commit()
        // res.send("success!");
        res.redirect('/blogs/'+ req.params.blogId)
    } catch (err) {
        await conn.rollback();
        next(err);
    } finally {
        console.log('finally')
        conn.release();
    }
});

// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
    return
});

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
    return
});


router.put('/comments/addlike/:commentId', async function (req, res, next) {
    return
});


exports.router = router