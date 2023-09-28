const pool = require('./db_Connection');

exports.FetchAccountInfo = async (username) => {
    try{
        const query = `SELECT guestID, guestName, guestContactInfo, guestEmail, userName, userPass
        FROM amsguests
        WHERE userName =?`
        const [queryResults] = await pool.query(query, [username]);
        return queryResults;
    } catch (error){
        console.error("Error:", error);
    }
}