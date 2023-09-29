const pool = require('./db_Connection');

exports.FetchAccountInfo = async (usrID) => {
    try {
        const query = `SELECT guestName, guestContactInfo, guestEmail, userName, userPass
        FROM amsguests
        WHERE guestID = ?`;
        const [queryResults] = await pool.query(query, [usrID]);
        return queryResults;
    } catch (error) {
        console.error("Error in FetchAccountInfo:", error); // Log detailed error messages
        throw error; // Rethrow the error to propagate it further
    }
};
