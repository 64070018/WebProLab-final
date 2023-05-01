const express = require("express");
const pool = require("../config");

const router = express.Router();

// Get comment
router.get('/:blogId/comments', function (req, res, next) {

});

// Create new comment
router.post('/:blogId/comments', async function (req, res, next) {

    try {
        // let comment = req.query.comment
        // let like = Number(req.query.like)
        let id = req.params.blogId
        // const {comment, like} = req.body;
        const comment = req.body.comment;
        const like = req.body.like;
        const by = req.body.by;

        const date = await pool.query("select CURRENT_TIMESTAMP")
        console.log("date", date)
        const [rows, fields] = await pool.query("insert into comments(blog_id, comment, comments.like, comment_by_id) value(?,?,?,?)",
            // [Number(id), comment, Number(like), null])

            [req.params.blogId, comment, like, by])
        console.log("asdf", rows)

        res.send(`A new comment is added (ID: ${rows.insertId})`)
    } catch (err) {
        return next(err)
    }
});

// Update comment
router.put('/comments/:commentId', async function (req, res, next) {
    let commentId = req.params.commentId
    let newComment = req.body.newComment;

    const [rows, fields] = await pool.query("update comments set comment = ? where id = ?",
        [newComment, commentId])

    const [numLike, fields2] = await pool.query("select comments.like from comments where id = ?", [commentId])
    const [date, fields3] = await pool.query("select comments.comment_date from comments where id = ?", [commentId])
    const [id, fields4] = await pool.query("select comments.comment_by_id from comments where id = ?", [commentId])

    // var test = date[0].comment_date.substring(1, 10);
    // console.log(test)

    var data = {
        'comment': 'edit comment',
        'like': numLike[0].like,
        'comment_date': date[0].comment_date,
        'comment_by_id': id[0].comment_by_id,
        'blog_id': commentId
    }

    res.send({
        "message": `Comment ID ${commentId} is updated.`,
        "comment": data
    })
});

// Delete comment
router.delete('/comments/:commentId', async function (req, res, next) {
    let commentId = req.params.commentId

    const [rows, fields] = await pool.query("delete from comments where id = ?",
        [commentId])

    if (rows.affectedRows > 0) {
        res.send({
            "message": `Comment ID ${commentId} is deleted.`,
        })

    } else{
        res.send({
            "message" : "can't delete."
        })
    }
});

// Delete comment
router.put('/comments/addlike/:commentId', async function (req, res, next) {
    let commentId = req.params.commentId

    var [numLike, fields1] = await pool.query("SELECT * FROM comments WHERE id = ?", [commentId])
    var [blog_id, fields1] = await pool.query("SELECT blog_id FROM comments WHERE id = ?", [commentId])

    numLike = numLike[0].like + 1

    console.log(numLike)
    const [rows, fields2] = await pool.query("update comments set comments.like = ? where id = ?",
        [numLike, commentId])

    res.send({
        "blogId": blog_id[0].blog_id,
        "commentId": Number(commentId),
        "likeNum": numLike,
    })
});


exports.router = router