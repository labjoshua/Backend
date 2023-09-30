const pool = require('./db_Connection');

async function ForgotPassword(email) {
  try {
    const query = `SELECT * FROM amsguests WHERE guestEmail = ?`;
    const [queryResults] = await pool.query(query, [email]);

    const usID = queryResults[0].guestID
    return {queryResults : queryResults, userID : usID};
  } catch (error) {
    console.error("Error in ForgotPassword query:", error);
    throw error;
  }
}

let publicOTP
function generateRandomOTP(length) {
  const charset = "0123456789";
  let otp = "";
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsetLength);
    otp += charset[randomIndex];
  }
  publicOTP=otp
  return publicOTP;
}

async function VerifyOTP(vOTP){
  try {
  if(publicOTP === vOTP) {
      return {success: true, message : "Reset Password now."}
  }
  else{
      return {success: false, message: "OTP didn't match!"}
  } 
  } catch (error) {
      console.error('Error occured', error)
      return
  }
  
  
}

module.exports = { ForgotPassword, generateRandomOTP, VerifyOTP };
