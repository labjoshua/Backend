const pool = require('./db_Connection');

exports.ReservationInfo = async () => {
  try {
    const roomsql = `SELECT roomID, roomName
        FROM roominformation`;

    const roomResults = await pool.query(roomsql);

    console.log("Room Results:", roomResults);

  } catch (error) {
    console.error("Error:", error);
  }
};

ReservationInfo();
