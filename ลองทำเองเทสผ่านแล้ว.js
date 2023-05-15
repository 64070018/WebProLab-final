const express = require('express');
const app = express();

const Joi = require("joi")
const pool = require('./config/database');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 *  เริ่มทำข้อสอบได้ที่ใต้ข้อความนี้เลยครับ
 * !!! ไม่ต้องใส่ app.listen() ในไฟล์นี้นะครับ มันจะไป listen ที่ไฟล์ server.js เองครับ !!!
 * !!! ห้ามลบ module.exports = app; ออกนะครับ  ไม่งั้นระบบตรวจไม่ได้ครับ !!!
*/


// update table set attr = value where condition
// insert into table(attr) values(),();
// delete from table where condition;
// select * from join using on connect where condition;

// อย่าลืม res.send()

// ดูชื่อคอลัมดีๆ บางทีมันเป้นคำสั่ง order by or group from brabrabra

// date.now() => ออกเป็นตัวเลข
// new Date() => console.log(date); // Fri Jun 17 2022 11:27:28 GMT+0100 (British Summer Time)
// DATE_FORMAT(check_in, '%Y-%m-%d') as check_in


// Joi
//     try {
//         // await check_date.validate(req.query, { abortEarly: false })
//         await check_date.validateAsync(req.query, { abortEarly: false })
//     } catch (err) {
//         console.log(err)
//         return res.status(400).json(err)
//     }


// const check_date = Joi.object({
//     start_date: Joi.date().iso().required().label("ต้องกรอก star_date"),
//     end_date: Joi.date().iso().required().when('start_date', {
//         is: Joi.date().required(),
//         then: Joi.date().min(Joi.ref('start_date')).required()
//     })
// })
const check_require = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    due_date: Joi.date()
})
app.post('/todo', async (req, res) => {
    try {
        await check_require.validateAsync(req.body, { abortEarly: false })
    } catch (err) {
        console.log(err)
        return res.status(400).send({message: err.details[0].context.label})
        
        if (!req.body.title) {
            return res.status(400).send({
                "message": "ต้องกรอก title"
            })
        }
        if (!req.body.description) {
            return res.status(400).send({
                "message": "ต้องกรอก description"
            })
        }
        // return res.status(400).send(err)
    }

    const title = req.body.title
    const des = req.body.description

    let due_date = req.body.due_date
    const [order] = await pool.query('select MAX(t.order) as der from todo t')

    let der = order[0].der + 1

    if (!due_date) {
        due_date = new Date()
        console.log(due_date)
    } else {
        due_date = req.body.due_date
    }

    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        const [todo] = await conn.query('insert into todo(title, description,due_date, `order`) values(?,?,?, ?)', [title, des, due_date, der])
        const [getDate] = await conn.query(' SELECT *, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date FROM todo where id = ?', [todo.insertId])

        conn.commit()
        res.status(201).send({
            "message": `สร้าง ToDo '${title}' สำเร็จ`,
            "todo": {
                "id": todo.insertId,
                "title": title,
                "description": des,
                "due_date": getDate[0].due_date,
                "order": der
            }
        })
    } catch (err) {
        console.log(err)
    } finally {
        conn.release()
    }
})

app.delete('/todo/:id', async (req, res) => {
    const [todo] = await pool.query('select title from todo where id = ?', [req.params.id])
    const conn = await pool.getConnection()
    await conn.beginTransaction()
    try {
        await conn.query('delete from todo where id =?', [req.params.id])
        conn.commit()
        res.status(200).send({
            "message": `ลบ ToDo '${todo[0].title}' สำเร็จ`,
        })
    } catch (err) {
        console.log(err)
        res.status(404).send({
            "message": "ไม่พบ ToDo ที่ต้องการลบ"
        })
    } finally {
        conn.release()
    }
})

// then เมื่อ start daate เป็น date ทำต่อจาก is
const check_date = Joi.object({
    start_date: Joi.date().iso().required().label('ต้องกรอก titile'),
    end_date: Joi.date().iso().required().when('start_date', {
        is: Joi.date().required(),
        then: Joi.date().min(Joi.ref('start_date')).required()
    })
})

app.get('/todo', async (req, res, next) => {
    const start_date = req.query.start_date
    const end_date = req.query.end_date
    if (start_date || end_date) {
        const [todo] = await pool.query(`
    select *, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date
    from todo
    where due_date between ? and ?`, [req.query.start_date, req.query.end_date])
        res.status(200).send(todo)
    }
    else {
        const [todo] = await pool.query(`
    select *, DATE_FORMAT(due_date, "%Y-%m-%d") AS due_date
    from todo`, [req.query.start_date, req.query.end_date])
        res.status(200).send(todo)

    }
})
module.exports = app;
