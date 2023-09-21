const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// Apply API authentication middleware to all routes

    app.post('/Components/Login', async (req, res) => {
        try {
          const { username, password } = req.body;
          const authenticationResult = await authenticateUser(username, password);
          if (authenticationResult === 'Authentication successful.') {
            res.status(200).json({ message: 'Authentication successful.'});
          } else {
            res.status(401).json({ message: authenticationResult }); // Return error as JSON
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error.' }); // Return error as JSON
        }
    })

// ... (other routes and server listening)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
