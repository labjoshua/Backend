const db = require('../Components/db_Connection');
const crypto = require('crypto');
const LoginQuery = 'SELECT * FROM amsusers WHERE userName = ?';

function hashPassword(password) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(password);
  const hashed = sha256.digest('hex');
  return hashed.toUpperCase(); // Convert the hash to uppercase
}

async function authenticateUser(username, password) {
  try {
    const hashedPassword = hashPassword(password); // Hash the provided password

    // Fetch user information based on the username
    const [user] = await db.promise().query(LoginQuery, [username]);

    if (!user || !user.length) {
      return 'Authentication failed. Incorrect username or password.';
    }

    const hashedPasswordFromDB = user[0].userPassword;

    // Compare the hashed provided password with the hashed password from the database
    if (hashedPassword === hashedPasswordFromDB) {
      return 'Authentication successful.';
    } else {
      return 'Authentication failed. Incorrect username or password.';
    }
  } catch (err) {
    console.error('Error executing query:', err);
    return 'Internal server error.';
  }
}

module.exports = {
  authenticateUser,
};
