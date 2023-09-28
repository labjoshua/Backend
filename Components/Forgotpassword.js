const pool = require('./db_Connection');

exports.ForgotPassword = async(username) =>{
    try{
        const query = `SELECT * FROM amsguests WHERE guestEmail = ?`
        const [queryResults]  = await pool.query(query, [username]);
        return queryResults;
    } catch (error) {
        console.error("Error:", error)
        throw error;
    }
}