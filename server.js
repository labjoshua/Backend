const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');
const { RegisterGuest } = require('./Components/Registration');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

//Route for the login authentication
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


//Route for Guest Reservation
app.post('/Components/Registration', async(req,res)=>{
  try{
    const { guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass} = req.body
    const registration = await RegisterGuest (guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass);
    if (registration === 'Registration successful'){
      res.status(200).json({ message: registration});
    } else{
      res.status(401).json({message: authenticationResult});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error.'}) 
  }
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
