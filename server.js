const express = require('express');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParse.json());

app.post('/Components/Login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const authenticationResult = await authenticateUser(username, password);
        if (authenticationResult === 'Authentication successful.') {
            res.status(200).json({ message: 'Authentication successful.' });
        } else {
            res.status(401).json({ message: authenticationResult });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});