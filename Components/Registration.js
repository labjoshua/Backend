const pool = require('./db_Connection');
const crypto = require('crypto');

function hashPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

exports.registerGuest = async (guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass) => {
    try {
        // Hash the userPass using SHA-256 and convert it to uppercase
        const hashedUserPass = hashPassword(userPass).toUpperCase();

        const sql = `INSERT INTO amsguests (guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass)
        VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [
            guestName,
            guestContactInfo,
            guestEmail,
            EncodedDate,
            userName,
            hashedUserPass, // Use the hashed password here
        ];

        const [results] = await pool.execute(sql, values);

        if (results.affectedRows === 1) {
            // Successfully inserted one row
            return 'Registration successful';
        } else {
            return 'Error inserting data';
        }
    } catch (err) {
        console.error('Error inserting data:', err);
        return 'Internal server error.';
    }
};
