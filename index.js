const express = require('express');
const database = require('./config/db.js');
const md5 = require('md5')
const bodyParser = require('body-parser');
const { generateToken } = require('./config/jwt.js');
const multer = require('multer');
const xlsx = require('xlsx');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
const PORT = 4500;


app.post("/:tablename", (req, res) => {

    let tableName = req.params.tablename;

    if (!tableName) {
        res.status(404).send("table name is given ")
    } else {
        // Query to create table 
        let query = `CREATE TABLE ${tableName} ( 
      name VARCHAR(255), password VARCHAR(255))`;

        database.query(query, (err, rows) => {
            if (err) return res.status(500)
                .send("Table Creation Failed");

            return res.send(
                `Successfully Created Table - ${tableName}`);
        })
    }
});

app.post('/signup', (req, res) => {
    try {
        let user = req.body;
        let encryptedPassword = md5(user.password);
        let query = `INSERT INTO user (name, password ) VALUES ('${user.name}', '${encryptedPassword}')`;

        let response = database.query(query, (err, rows) => {
            if (err) {
                res.status(404).send("Faild to add user", err);
            }
            res.send(`User added `);
        })

    } catch (error) {
        res.send(500).status("invalid", error)
    }
})
app.post('/login', (req, res) => {
    try {
        let user = req.body;
        let tempPassword = md5(user.password)
        let query = `SELECT * FROM user WHERE name = '${user.name}'`;

        let response = database.query(query, (err, rows) => {
            if (err) {
                return res.status(404)
                    .send("Faild to fetch user", err);
            }
            if (tempPassword == rows[0].password) {

                const token = generateToken(user);

                res.json({
                    success: true,
                    message: 'Authentication successful!',
                    token: token,
                });

            } else {
                res.json("password is incorrect")
            }

        })
    } catch (error) {
        res.send(error)
    }
})

app.post('/upload', (req, res) => {
    try {
        const file = xlsx.readFile('./chat.xlsx')
        const sheets = file.SheetNames;
        let data = [];

        for (let i = 0; i < sheets.length; i++) {
            const temp = xlsx.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]])
            temp.forEach((res) => {
                data.push(res)
            })
        }

        // let newData = data.forEach((item) => {
        //     console.log(item);

        // },



        // let query = `INSERT INTO exportChat (name, chat ) VALUES ('${user.name}', '${encryptedPassword}')`;

        console.log(data);


        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} ...`);
});