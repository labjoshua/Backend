const db = require('./db_Connection');
const crypto = require('crypto');

const LoginQuery = 'SELECT * FROM amsusers WHERE userName = ? AND userPassword = ?';
const username = 'admin'
const password = 'admin'

function hashPassword(password){
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex')
}

const hashedPassword = hashPassword(password);
db.query(LoginQuery, [username, hashedPassword], (err, results) =>{
    if (err) {
        console.error('Error executing query:', err);
        return;
    }

    if (results.length === 0){
        console.log('No matching records found.');
    } else{
        console.log('Query results:', results)
    }
});