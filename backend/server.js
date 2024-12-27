const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const saltRounds = 10;

server.use(bodyParser.json());
server.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection error:', err);
    } else {
        console.log('Database connected');
    }
});

server.get('/',(req,res)=>{
    res.send('Hello World')
});

// Registration endpoint
server.post('/signup', (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error hashing password' });
        } else {
            db.query('INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)', [firstName, lastName, username, hash], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: 'Error storing user' });
                } else {
                    res.send({ message: 'User registered successfully' });
                }
            });
        }
    });
});

// Login endpoint
server.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: 'Error querying database' });
        } else {
            console.log(result.length);
            if (result.length > 0) {
                console.log(result);
                const hashedPassword = result[0].password;
                console.log('Hashed password from DB:', hashedPassword);
                console.log('Password from request:', password);
                
                bcrypt.compare(password, hashedPassword, (err, isMatch) => {
                    console.log("Password Match:", isMatch);
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: 'Error comparing passwords' });
                    } else if (isMatch) {
                        res.json({ message: 'Login successful' });
                    } else {
                        res.json({ message: 'Invalid username or password' });
                    }
                });
            } else {
                res.send({ message: 'Invalid username or password' });
            }
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});