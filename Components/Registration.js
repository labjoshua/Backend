const pool = require('./db_Connection');
const crypto = require('crypto');

exports.registerGuest = async (guestName, guestContactInfo, guestEmail, EncodedDate, userName, userPass) => {
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

    return new Promise((resolve, reject) => {
        pool.execute(sql, values, (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                reject('Error inserting data');
            } else {
                console.log('Data inserted successfully:', results);
                resolve('Registration successful');
            }
        });
    });
};

function hashPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}
