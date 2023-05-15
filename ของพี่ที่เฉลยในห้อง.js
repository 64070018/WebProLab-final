const express = require('express');
const app = express();

const Joi = require("joi")
const pool = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
*/

// tip


// '/:params/' => req.params.name
// '/?string/' => req.query.name


// update put
// create post
// delete delete
// select get data ไม่จำเป็นต้องทำ transection
app.get('/get_todo', async (req, res) => {
    const [todo] = await pool.query('select * from todo')

    const data = { name: 'fern' }
    const { name } = data // fern
    function fern() {
        return new Promise()
    }
    function fern2() {
        return "fern"
    }

    // ดักาค่า null []

    let array = []
    let nulVal = null // false
    if (!nulVal) {
        // do sth
        res.send("nulVar is null")
    }

    if (!array.length || array.length == 0) {
        res.send("array is null")
    }
    const asdf = await fern()
    const qwer = await fern2() // ไม่จำเป็นต้อง await
    return res.send(data)  // will send only round so put after return

})


// update put
// create post
// delete delete
// select get data ไม่จำเป็นต้องทำ transection

// ข้อ 2 delete
app.delete('/todo/:id', async (req, res) => {
    // '/:params/' => req.params.name
    // '/?string/' => req.query.name
    const id = req.params.id
    const [todo] = await pool.query('select * from todo where id = ?', [id]) // array

    if (todo.length == 0) {
        return res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })
    }


    // transection
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        // pool ?
        const [data] = await pool.query('delete from todo where id = ?', [id])
        await conn.commit()
        res.status(200).send({
            "message": `ลบ ToDo '${todo[0].title}' สำเร็จ`,
        })
    } catch (err) {
        console.log(err)
        conn.rollback()
        res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })

    } finally {
        conn.release() // don't forget
    }
})




// ข้อ 3
// then เมื่อ start daate เป็น date ทำต่อจาก is
const check_date = Joi.object({
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().required().when('start_date', {
        is: Joi.date().required(),
        then: Joi.date().min(Joi.ref('start_date')).required()
    })
})
// valid("รับได้แค่", "ที่กำหนดไว้")


app.get('/todo', async (req, res) => {
    console.log("enter")
    try {
        // await check_date.validate(req.query, { abortEarly: false })
        await check_date.validateAsync(req.query, { abortEarly: false })
    } catch (err) {
        console.log(err)
        return res.status(400).json(err)
        
//         วิธีมะปราง
        if(result.error && title == ""){
            return res.status(400).send({message: "ต้องกรอก titile"})
        }
//         
    }

    const start_date = req.query.start_date
    const end_date = req.query.end_date
    console.log(start_date)
    console.log(end_date)
    const [todo] = await pool.query(`select *, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date from todo where due_date between ? and ?`, [start_date, end_date])

    res.status(200).send(todo)

})







module.exports = app;
