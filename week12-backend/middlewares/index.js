const pool = require("../config");

const blogOwner = async (req, res, next) => {
    const [[blog]] = await pool.query('SELECT * FROM blogs WHERE id=?', [req.params.id])

    if (blog.create_by_id !== req.user.id) {
        return res.status(403).send('You do not have permission to perform this action')
    }
    next()
}


async function logger(req, res, next) {
    const timestamp = new Date().toISOString().substring(0, 19)
    console.log(`${timestamp} | ${req.method}: ${req.originalUrl}`)
    next()
}


async function isLoggedIn(req, res, next) {
    let authorization = req.headers.authorization // get data  from header

    if (!authorization) {
        return res.status(401).send('You are not logged in') // if not have header = not logged in
    }

    let [part1, part2] = authorization.split(' ')
    // format authorization token is header : { "authorization": "Bearer $$TOKEN$$"}
    if (part1 !== 'Bearer' || !part2) {
        return res.status(401).send('You are not logged in')
    }

    // Check token
    const [tokens] = await pool.query('SELECT * FROM tokens WHERE token = ?', [part2])
    const token = tokens[0]
    if (!token) {
        return res.status(401).send('You are not logged in')
    }

    // Set user
    const [users] = await pool.query(
        'SELECT id, username, first_name, last_name, email, picture, mobile, join_date, role ' +
        'FROM users WHERE id = ?', [token.user_id]
    )
    req.user = users[0] // every route will can access to user

    next()
}

module.exports = {
    logger,
    isLoggedIn,
    blogOwner
}