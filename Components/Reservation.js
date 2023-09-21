const pool = require('./db_Connection');

exports.ReserveGuest = async (guestID, roomID, reservationDateFrom, reservationDateTo, reservationStatus) => {
    try {
        const sql = `INSERT INTO amsreservation(guestID, roomID, reservationDateFrom, reservationDateTo, reservationStatus)
        VALUES (?, ?, ?, ?, ?)`;

        const values = [
            guestID,
            roomID,
            reservationDateFrom,
            reservationDateTo,
            reservationStatus
        ];

        const [results] = await pool.execute(sql, values);

        if (results.affectedRows === 1) {
            // Successfully inserted one row
            return 'Reservation successful';
        } else {
            return 'Error inserting data';
        }
    } catch (err) {
        console.error('Error inserting data:', err);
        return 'Internal server error.';
    }
};
