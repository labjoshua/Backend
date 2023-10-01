require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const { authenticateUser } = require('./Components/Login');
const { registerGuest } = require('./Components/Registration');
const { ReserveGuest } = require('./Components/Reservation')
const { ForgotPassword, generateRandomOTP, VerifyOTP } = require('./Components/Forgotpassword');
const { ReservationInfo } = require('./Components/ReservationInfo');
const { updateUserData } = require('./Components/UpdateInfo');
const { sendMail } = require('./Components/ResetPassword')
const { FetchAccountInfo } = require('./Components/FetchAccountInfo');
const cors = require('cors')

const app = express();


const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions))


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

//Implemented na sa FrontEnd
app.post('/Components/Login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const authenticationResult = await authenticateUser(username, password);
    if (authenticationResult.success) {
      const uId  = authenticationResult.userId;
      const user =  username;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      const expirationTime = new Date(Date.now() + 10 * 1000);
      res.cookie('access_token', accessToken, { httpOnly: true, expires: expirationTime });
      res.cookie('userID', uId, { httpOnly: true, expires: expirationTime });
      res.cookie('username', user , { httpOnly: true, expires: expirationTime })
      res.status(200).json({ 
        message: 'Authentication successful.', 
        accessToken, 
        user, 
        uId,
      expiresAt:expirationTime.getTime(), });
    } else {
      res.status(401).json({ message: authenticationResult.message }); // Return error as JSON
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' }); // Return error as JSON
  }
});


//Implemented na sa FrontEnd
app.get('/Components/RoomInfo', authenticateToken, async (req, res) => {
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


//Implemented na sa FrontEnd
app.post('/Components/Registration', async (req, res) => {
  try {
    const { guestName, guestContactInfo, guestEmail, userName, userPass } = req.body;
    const registration = await registerGuest(guestName, guestContactInfo, guestEmail, userName, userPass);
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


//Implemented na sa FrontEnd
app.get('/Components/FetchAccountInfo', authenticateToken, async (req, res) => {
  try {
    const { usrID } = req.query; // Retrieve usrID from query parameters

    if (!usrID) {
      // If usrID is missing or empty, respond with a bad request error
      return res.status(400).json({ error: 'Bad Request: usrID parameter is missing.' });
    }

    const queryResults = await FetchAccountInfo(usrID);
    const userData = queryResults.map(usrInfo => ({
      guestName: usrInfo.guestName,
      guestContactInfo: usrInfo.guestContactInfo,
      guestEmail: usrInfo.guestEmail,
      userName: usrInfo.userName,
      userPass: usrInfo.userPass,
    }));
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'An error occurred in the server' });
  }
});


//Implemented na sa FrontEnd
app.patch('/Components/UpdateInfo', authenticateToken, async (req,res)=>{
  console.log(req.body)
  try{
    const { guestID, guestName, guestContactInfo, guestEmail, userName, userPass } = req.body;
    const updateinfo = await updateUserData(guestID, guestName, guestContactInfo, guestEmail, userName, userPass);
    if (updateinfo === 'User data updated successfully') {
      res.status(200).json({ message: updateinfo})
    }else{
      res.status(401).json({message: 'Error updating user data'})
    }
  }catch (error){
    console.error(error);
    res.status(500).json({message: 'Internal server error.'})
  }
})


//Implemented na sa FrontEnd
app.post('/Components/Reservation', authenticateToken, async (req, res)=>{
  try{
    console.log(req.body)
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

//Implemented na sa FrontEnd
app.post('/Components/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const forgot = await ForgotPassword(email);
    if (forgot.length === 0) {
      return res.status(404).json({ error: "Email not found" });
    }
    const UID = forgot.userID
    const showOtp = generateRandomOTP(6)
    console.log(showOtp)
    const emailResult = sendMail(email, showOtp)
    if (emailResult.error){
      return res.status(emailResult.status).json({ error: emailResult.error});
    }else{
      res.cookie('userID', UID, {httpOnly : true})
      res.status(200).json({ message: 'OTP sent to the email', userID : UID})
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Implemented na sa FrontEnd
app.post('/Components/verifying-OTP', async(req, res)=>{
  try {
    const { otp } = req.body
    const VerifyOTPs = await VerifyOTP(otp)
    if (VerifyOTPs.success){
      res.status(200).json({ message : 'Authentication successful'})
    } else{
      return res.status(400).json ({ error: VerifyOTPs.message});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
})

//Implemented sa Frontend
app.patch('/Components/UpdatePassword', async(req, res)=>{
  try{
    const { userPass, guestID } = req.body;
    const updateinfo = await updateUserData( userPass, guestID );
    if (updateinfo === 'User data updated successfully') {
      res.status(200).json({ message: updateinfo})
    }else{
      res.status(401).json({message: 'Error updating user data'})
    }
  }catch (error){
    console.error(error);
    res.status(500).json({message: 'Internal server error.'})
  }
})

//Implemented sa Frontend
app.post('/logout', authenticateToken, (req, res) => {
  // Clear cookies
  res.clearCookie('access_token');
  res.clearCookie('userID');
  res.clearCookie('username');
  
  // Send a response indicating successful logout
  res.status(200).json({ message: 'Logout successful' });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});