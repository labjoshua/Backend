require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateUser } = require('./Components/Login');
const { registerGuest } = require('./Components/Registration');
const { ReserveGuest } = require('./Components/Reservation')
const { ForgotPassword } = require('./Components/Forgotpassword');
const { ReservationInfo } = require('./Components/ReservationInfo');
const { UpdateAcc } = require('./Components/UpdateInfo');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());


//Middleware of authentication token
//{This is the scope of verifying the access token of client
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
//}

// Route for the login authentication
app.post('/Components/Login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const authenticationResult = await authenticateUser(username, password);
    if (authenticationResult === 'Authentication successful.') {
      const user = { username: username };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.cookie('access_token', accessToken, { httpOnly: true });
      res.cookie('username', user, { httpOnly: true});
      res.status(200).json({ message: 'Authentication successful.', accessToken: accessToken, user: user });
    } else {
      res.status(401).json({ message: authenticationResult }); // Return error as JSON
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' }); // Return error as JSON
  }
});

//Route for Getting Room information and ID of user as well

app.get('/Components/ReservationInfo', authenticateToken, async (req, res) => {
  try {
    const roomData = await ReservationInfo(); // Correctly call the function
    const roomInfo = roomData.map(room => ({
      roomID: room.roomID,
      roomName: room.roomName
    }));
    res.status(200).json(roomInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
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

//Route for Fetching account before updating
app.get('/Components/FetchAccountInfo', async(req,res)=>{
  try{
    const {username} = req.body;
  }catch{

  }
})


//Route for UpdatingAccount
app.patch('/Components/UpdateInfo', async (req,res)=>{
  try{
    const { guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass } = req.body;
    const updateinfo = await UpdateAcc (guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass);
    if (updateinfo === '') {
      res.status(200).json({ message: ''})
    }else{
      res.status(401).json({message: ''})
    }
  }catch (error){
    console.error(error);
    res.status(500).json({message: ''})
  }
})

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