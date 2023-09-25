const pool = require('./db_Connection');

exports.FetchAccountInfo = async () => {
    try{
        const query = `SELECT guestName, guestContactInfo, guestEmail, userName, userPass
        FROM amsguests
        WHERE userName =?`
        const queryResults = await pool.query(query);
        return queryResults;
    } catch (error){
        console.error("Error:", error);
    }
}