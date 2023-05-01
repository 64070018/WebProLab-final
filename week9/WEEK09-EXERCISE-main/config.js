const mysql = require("mysql2/promise")

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'asdf1234',
    database: 'webpro'
})

module.exports = pool