const express = require("express");
const pool = require("../config");
const Joi = require("joi")

router = express.Router();


const bcrypt = require('bcrypt')



const passwordValidator = (value, helpers) => {
    if (value.length < 8) {
        throw new Joi.ValidationError('Password must contain at least 8 characters')
    }
    if (!(value.match(/[a-z]/) && value.match(/[A-Z]/) && value.match(/[0-9]/))) {
        throw new Joi.ValidationError('Password must be harder')
    }
    return value
}
const usernameValidator = async (value, helpers) => {
    // _ instant variable not for use in future
    const [rows, _] = await pool.query(
        "SELECT username FROM users WHERE username = ?",
        [value]
    )
    if (rows.length > 0) {
        // const message = 'This user is already taken'
        // throw new Joi.ValidationError(message, { message })
        throw new Joi.ValidationError("DUPLICATE_ERROR", {
            details: "this username is already taken"
        })
        // or throw Joi.ValidationError('This username is already taken')
    }
    return value
}
const signupSchema = Joi.object({
    email: Joi.string().email().required().max(100),
    mobile: Joi.string().required().pattern(/0[0-9]{9}/), // string 0 เลข 0-9 จำนวน 9 ตัว
    first_name: Joi.string().required().min(5).max(150),
    last_name: Joi.string().required().min(5).max(150),
    password: Joi.string().required().custom(passwordValidator),
    comfirm_password: Joi.string().required().equal(Joi.ref('password')),
    username: Joi.string().required().min(5).external(usernameValidator),
})





router.post('/user/signup', async (req, res, next) => {

    try {
        await signupSchema.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
    }
    const conn = await pool.getConnection()
    await conn.beginTransaction()

    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 5) // encript password
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const mobile = req.body.mobile

    try {
        await conn.query(
            'INSERT INTO users(username, password, first_name, last_name, email, mobile) ' +
            'VALUES (?, ?, ?, ?, ?, ?)',
            [username, password, first_name, last_name, email, mobile]
       )
        conn.commit()
        res.status(201).send()
    } catch (err) {
        conn.rollback()
        res.status(400).json(err.toString());
    } finally {
        conn.release()
    }
})

exports.router = router