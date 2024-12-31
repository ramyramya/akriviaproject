const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Model } = require('objection');
const knex = require('./util/database');
const User = require('./models/User');

const saltRounds = 10;
const jwtSecret = 'secret';

server.use(bodyParser.json());
server.use(cors());

// Registration endpoint
server.post('/signup', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    await User.query().insert({
      firstName,
      lastName,
      username,
      password: hash
    });
    res.send({ message: 'User registered successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error storing user' });
  }
});

// Login endpoint
server.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.query().findOne({ username });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ username : user.username },jwtSecret, { expiresIn: '1m' });    
        res.json({ message: 'Login successful',token: token });
      } else {
        res.json({ message: 'Invalid username or password' });
      }
    } else {
      res.json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error querying database' });
  }
});


// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
      jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
          return res.status(403).send({ message: 'Token expired or invalid' });
        }
        req.user = user;
        console.log("UseR: ",req.user); 
        next();
      });
    } else {
      res.status(401).send({ message: 'Authorization token required' });
    }
  };
  
  // Protected route example
  server.get('/home', authenticateJWT, (req, res) => {
    res.send({ message: 'Welcome to the home page!' });
  });

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});