const db = require('./db_Connection');
const bcrypt = require('bcrypt');
const LoginQuery = 'SELECT * FROM amsusers WHERE userName = ?';

async function authenticateUser(username, password) {
  try {
    // Fetch user information based on the username
    const [user] = await db.promise().query(LoginQuery, [username]);

    if (!user || !user.length) {
      console.log('User not found.');
      return;
    }

    const hashedPasswordFromDB = user[0].userPassword;

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, hashedPasswordFromDB);

    if (passwordMatch) {
      console.log('Authentication successful.');
      console.log('User details:', user[0]);
    } else {
      console.log('Authentication failed. Incorrect password.');
    }
  } catch (err) {
    console.error('Error executing query:', err);
  }
}

authenticateUser(username, password);
