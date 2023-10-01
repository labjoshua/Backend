const pool = require('./db_Connection');
const crypto = require('crypto');

function hashPassword(password) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(password);
  return sha256.digest('hex').toUpperCase();
}

exports.updateUserData = async (guestID, guestName, guestContactInfo, guestEmail, userName, userPass) => {
  try {
    // Hash the new password using SHA-256 and convert it to uppercase
    if (userPass) {
      userPass = await hashPassword(userPass);
    }

    const setStatements = [];
    const updateValues = [];

    // Check if fields are not null or empty, and include them in the update
    if (guestName) {
      setStatements.push('guestName = ?');
      updateValues.push(guestName);
    }
    if (guestContactInfo) {
      setStatements.push('guestContactInfo = ?');
      updateValues.push(guestContactInfo);
    }
    if (guestEmail) {
      setStatements.push('guestEmail = ?');
      updateValues.push(guestEmail);
    }
    if (userName) {
      setStatements.push('userName = ?');
      updateValues.push(userName);
    }
    if (userPass) {
      setStatements.push('userPass = ?');
      updateValues.push(userPass);
    }

    if (setStatements.length === 0) {
      // No valid fields to update
      return 'No valid fields to update';
    }

    // Construct the SQL query dynamically based on the valid fields to update
    const sql = `UPDATE amsguests SET ${setStatements.join(', ')} WHERE guestID = ?`;
    updateValues.push(guestID);

    const [results] = await pool.execute(sql, updateValues);

    if (results.affectedRows === 1) {
      // Successfully updated one row
      return 'User data updated successfully';
    } else {
      return 'User not found or error updating data';
    }
  } catch (err) {
    console.error('Error updating user data:', err);
    return 'Internal server error.';
  }
};
