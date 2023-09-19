const express = require('expres');
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParse.json());

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});