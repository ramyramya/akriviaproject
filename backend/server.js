const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Model } = require('objection');
const knex = require('./util/database');
const User = require('./models/User');

const saltRounds = 10;

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
        res.json({ message: 'Login successful' });
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

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});