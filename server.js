require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');
const { registerGuest } = require('./Components/Registration');
const { ReserveGuest } = require('./Components/Reservation')
const { ForgotPassword } = require('./Components/Forgotpassword')
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());


//Middleware of authentication token

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
if (err) return res.sendStatus(403)
req.user = user
next()
})
}

// Route for the login authentication
app.post('/Components/Login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const authenticationResult = await authenticateUser(username, password);
    if (authenticationResult === 'Authentication successful.') {
      const user = { username: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.status(200).json({ message: 'Authentication successful.', accessToken: accessToken });
    } else {
      res.status(401).json({ message: authenticationResult }); // Return error as JSON
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' }); // Return error as JSON
  }
});

// Route for Guest Registration
app.post('/Components/Registration', async (req, res) => {
  try {
    const { guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass } = req.body;
    const registration = await registerGuest(guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass);
    if (registration === 'Registration successful') {
      res.status(200).json({ message: 'Registration successful' });
    }else {
      res.status(401).json({ message: 'Error inserting data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

//Route for Reservation
app.post('/Components/Reservation', authenticateToken, async (req, res)=>{
  try{
    const { guestID, roomID, reservationDateFrom, reservationDateTo , reservationStatus} = req.body;
    const Reservation = await ReserveGuest( guestID, roomID, reservationDateFrom, reservationDateTo, reservationStatus );
    if (Reservation === 'Reservation successful'){
      res.status(200).json({ message: 'Reservation successful'});
    } else{
      res.status(401).json({ message: 'Error inserting data'})
    }
  } catch (error){
    console.error(error);
    res.status(500).json({ message: 'Internal server error.'})
  }
})

//Route for getting room informations
app.get('./', async(req, res)=>{

})

//Route for Forgot password ======
app.post('./Components/forgotpassword', async(req, res)=>{
  try{
    const { email } = req.body
    const forgot = await ForgotPassword()
  }catch{

  }
})

//Route for Updating password
app.post('./', async(req,res)=>{
  
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});