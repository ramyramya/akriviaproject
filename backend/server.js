const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

server.use(bodyParser.json());
server.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'project'
});

db.connect((err=>{
    if(err){
        throw err
    }
    console.log('Connected to database')
}));

server.get('/',(req,res)=>{
    res.send('Hello World')
});

server.post('/signup',(req,res)=>{
    const {firstName,lastName,username,password} = req.body
    console.log(firstName,lastName,username,password)
    db.query('INSERT INTO users (firstname,lastname,username,password) VALUES (?,?,?,?)',[firstName,lastName,username,password],(err,result)=>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).json({ message: 'User registered' }); // Send JSON response
    });
});

server.post('/login',(req,res)=>{
    const {username,password} = req.body
    db.query('SELECT * FROM users WHERE username = ? AND password = ?',[username,password],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length>0){
                res.json({message:'Login successfull'})
            }else{
                res.send({message:'Invalid username or password'})
            }
        }
    })
})

server.listen(3000,()=>{
    console.log('Server started on port 3000')
});