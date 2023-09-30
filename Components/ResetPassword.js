const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '269362135990-u998b83s5dcuggpkdj6uq10r2iqqp7qe.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04PedArHxRlKXCgYIARAAGAQSNwF-L9IrMTJDrEaRl8vDpFfnUT6x6mZJEBLr3yp4-zRZT5KQL2QEOjtSyH655hB8X0Nm-tv9PQ0';


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail(email, otp) {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
  
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'lab.joshacc@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
  
      const mailOptions = {
        from: 'Arthur Place <lab.joshacc@gmail.com>',
        to: email,
        subject: 'Reset password OTP',
        text: `Your password reset code is ${otp}`,
      };
  
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      
      console.error("Error sending email:", error);
      throw error;
    }
  }
  
  const email = 'joshuadevillapapa@gmail.com'
  const otp = '012345'
  sendMail(email, otp)
  .then(result => console.log('Email sent...', result))
  .catch((error) => console.log(error.message))