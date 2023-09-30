const pool = require('./db_Connection');

async function ForgotPassword(email) {
  try {
    const query = `SELECT * FROM amsguests WHERE guestEmail = ?`;
    const [queryResults] = await pool.query(query, [email]);
    return queryResults;
  } catch (error) {
    console.error("Error in ForgotPassword query:", error);
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

  return otp;
}

module.exports = { ForgotPassword, generateRandomOTP };
