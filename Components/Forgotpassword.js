// Forgotpassword.js

const pool = require('./db_Connection');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let globalOTP = "";

async function ForgotPassword(email) {
  try {
    const query = `SELECT * FROM amsguests WHERE guestEmail = ?`;
    const [queryResults] = await pool.query(query, [email]);
    return queryResults;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

function generateRandomOTP(length) {
  const charset = "0123456789";
  let otp = "";
  const charsetLength = charset.length;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    otp += charset[randomIndex];
  }

  globalOTP = otp;
  return otp;
}

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_Token : REFRESH_TOKEN });

async function sendMail(email) {
  try {
    const queryResults = await ForgotPassword(email);
    const accessToken = await oAuth2Client.getAccessToken();
    
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'lab.joshacc@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: 'Arthur Place <lab.joshacc@gmail.com>',
      to: queryResults[0].guestEmail,
      subject: 'Reset password OTP',
      text: `Your password reset code is ${globalOTP}`
    }

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = { ForgotPassword, sendMail };
