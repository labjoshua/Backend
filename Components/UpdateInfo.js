const pool = require('./db_Connection');
const crypto = require('crypto');

function hashPassword(password) {
  const sha256 = crypto.createHash('sha256');
  sha256.update(password);
  return sha256.digest('hex').toUpperCase();
}

exports.updateUserData = async ( userPass, guestID ) => {
  try {
    // Hash the new password using SHA-256 and convert it to uppercase
    if (userPass) {
      userPass = await hashPassword(userPass);
    }

    const sql = `UPDATE amsguests
                SET userPass = ?
                WHERE guestID = ?`;

    const updateValues = [
      userPass,
      guestID
    ];

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
