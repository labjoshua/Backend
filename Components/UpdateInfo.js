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

    const setStatements = [
      'guestName = ?',
      'guestContactInfo = ?',
      'guestEmail = ?',
      'userName = ?',
      'userPass = ?'
    ].join(', ');

    const sql = `UPDATE amsguests
                SET ${setStatements}
                WHERE guestID = ?`;

    const updateValues = [
      guestName,
      guestContactInfo,
      guestEmail,
      userName,
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
