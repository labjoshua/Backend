const pool = require('./db_Connection');
const crypto = require('crypto');


function hashPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

exports.updateUserData = async (userName, newData) => {
    try {
        // Hash the new password using SHA-256 and convert it to uppercase
        if (newData.userPass) {
            newData.userPass = await hashPassword(newData.userPass).toUpperCase();
        }

        const updateColumns = Object.keys(newData);
        const updateValues = Object.values(newData);
        updateValues.push(userName); // Add userName to the end for the WHERE clause

        const setStatements = updateColumns.map((col) => `${col} = ?`).join(', ');

        const sql = `UPDATE amsguests
                    SET ${setStatements}
                    WHERE userName = ?`;

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