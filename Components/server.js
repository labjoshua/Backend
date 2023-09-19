const express = require('express');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db_Connection');
const { authenticateUser } = require('./Login');

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParse.json());

app.post('/Login', async (req, res) =>{
    try{
        const{ username, password } = req.body;

        await authenticateUser(username, password);
    }
    catch (error){
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
});

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});