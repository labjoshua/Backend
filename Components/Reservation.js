const pool = require('./db_Connection');

exports.ReserveGuest = async (guestID, roomID, reservationDateFrom, reservationDateTo, reservationStatus) => {
    const sql = `INSERT INTO amsreservation(guestID, roomID, reservationDateFrom, reservationDateTo, reservationStatus)
    VALUES (?, ?, ?, ?, ?)`;

    const values = [
        guestID,
        roomID,
        reservationDateFrom,
        reservationDateTo,
        reservationStatus
    ];

    return new Promise((resolve, reject) => {
        pool.execute(sql, values, (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                reject('Error inserting data');
            } else {
                console.log('Data inserted successfully:', results);
                resolve('Reservation successful');
            }
        });
    });
};
