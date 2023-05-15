// file ROME
// https://github.com/RomeyKung/Webpro2023.git


// Update a todo by id
app.put('/todos/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, image, description, due_date, order } = req.body;
        const conn = await pool.getConnection();

        const [result] = await conn.query(
            'UPDATE todo SET title = ?, image = ?, description = ?, due_date = ?, `order` = ? WHERE id = ?',
            [title, image, description, due_date, order, id]
        );

        if (result.affectedRows === 0) {
            res.status(404).send('Todo not found');
        } else {
            res.sendStatus(204);
        }
        return res.status(200).json(result) ;

    } catch (err) {
        next(err);
    }
    finally {
        await conn.commit();
        conn.release();
    }
});


const email = req.body.email;
const [rows] = await db.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);
const { count } = rows[0];

if (count > 0) {
  const error = new Error('Email is already registered');
  error.status = 400;
  throw error;
}


const multer = require('multer')

// กำหนด disk storage สำหรับ multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

// สร้าง multer instance พร้อมกำหนด disk storage
const upload = multer({ storage: storage })

// กำหนด route สำหรับรองรับการอัปโหลดภาพ
app.post('/photos', upload.array('photos', 5), function (req, res, next) {
  // req.files จะมีค่าเป็น array ของ object โดยแต่ละ object จะเก็บข้อมูลของไฟล์แต่ละไฟล์ที่อัปโหลด
  console.log(req.files)
})



// sign in sign up
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

router.post('/signup', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if the username or email is already used
    const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    const [checkResult] = await pool.query(checkQuery, [username, email]);
    if (checkResult.length > 0) {
      return res.status(400).json({ message: 'The username or email is already used' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate a new UUID for the user
    const uuid = uuidv4();

    // Insert the new user into the database
    const insertQuery = `
      INSERT INTO users (id, username, email, password)
      VALUES (?, ?, ?, ?)
    `;
    await pool.query(insertQuery, [uuid, username, email, hashedPassword]);

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    return next(err);
  }
});