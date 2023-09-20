const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

const JW_SECRET = 'ad165b11320bc91501ab08613cc3a48a62a6caca4d5c8b14ca82cc313b3b96cd'; // Replace with your secret key

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized if no token
  }

  jwt.verify(token, JW_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user;
    next(); // Continue to the next middleware or route handler
  });
}

app.use(bodyParser.json());
app.use(cors());

// Apply API authentication middleware to all routes
app.use(authenticateToken);

app.post('/Components/Login', async (req, res) => {
    app.post('/Components/Login', async (req, res) => {
        try {
          const { username, password } = req.body;
          const authenticationResult = await authenticateUser(username, password);
          if (authenticationResult === 'Authentication successful.') {
            const token = jwt.sign({ username }, JW_SECRET);
            res.status(200).json({ message: 'Authentication successful.', token });
          } else {
            res.status(401).json({ message: authenticationResult }); // Return error as JSON
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error.' }); // Return error as JSON
        }
    })
      });

// ... (other routes and server listening)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
