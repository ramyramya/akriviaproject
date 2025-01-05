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
  const { firstName, lastName, dob, gender, username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log(dob);
    const utcDob = new Date(dob).toISOString(); // Convert dob to UTC
    await User.query().insert({
      firstName,
      lastName,
      dob: utcDob,
      gender,
      username,
      email,
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
        const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
        console.log("Token: ", token);
        res.json({ message: 'Login successful', token: token });
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
  //console.log(token);
  if (token) {
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        return res.status(403).send({ message: 'Token expired or invalid' });
      }
      req.user = user;
      console.log("UseR: ", req.user);
      next();
    });
  } else {
    res.status(401).send({ message: 'Authorization token required' });
  }
};

// Protected route example
server.get('/home', authenticateJWT, async (req, res) => {
  try {
    id = req.user.id;
    const result = await User.query().findById(id);
    console.log("Result: ", result);
    if (result) {
      result.dob = new Date(result.dob).toISOString().split('T')[0];
      res.send({ success: true, userData: result });
    }
    else {
      res.send({ success: false, userData: {} });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error querying database' });

  }
});


// Check if user exists endpoint
server.post('/check-username', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.query()
      .whereRaw('BINARY username = ?', [username])
      .first();

    if (user) {
      res.send({ exists: true, message: 'User exists' });
    } else {
      res.send({ exists: false, message: 'User does not exist' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error querying database' });
  }
});

/*server.get('/logout', (req, res) => {
  console.log("Request: ", req.headers);
  const token = req.headers.authorization;
  console.log("Token: ", token);
  if(token){
  localStorage.removeItem('token');
  res.send({ success: true, message: 'Logout successful' });
  }
  else{
    res.send({ success: false, message: 'Logout unsuccessful' });
  }
});*/

// New endpoint to get all user details
server.get('/users', authenticateJWT, async (req, res) => {
  try {
    const users = await User.query().select('id', 'firstname', 'lastname', 'dob', 'gender', 'email');
    res.send({ success: true, users });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error querying database' });
  }
});


// New endpoint to get user details by ID
server.get('/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.query().findById(id);
    if (user) {
      res.send({ success: true, user });
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error querying database' });
  }
});

// Update user endpoint
server.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dob, gender, username, email, password } = req.body;
  try {
    const user = await User.query().findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const updatedUser = {
      firstName,
      lastName,
      dob: new Date(dob).toISOString(), // Convert dob to UTC
      gender,
      username,
      email
    };

    if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      updatedUser.password = hash;
    }

    await User.query().patchAndFetchById(id, updatedUser);
    res.send({ message: 'User updated successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error updating user' });
  }
});

// Delete user endpoint
server.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.query().findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    await User.query().deleteById(id);
    res.send({ message: 'User deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Error deleting user' });
  }
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});