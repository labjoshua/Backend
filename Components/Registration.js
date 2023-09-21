const db = require('./db_Connection');



async function RegisterGuest(){
    try{
        const connection = await Pool.getConnection();
        const [rows] = await connection.execute(`INSERT INTO amsguests (guestName, guestContactInfo, guestEmail, EncodedDate)
        VALUES ?, ?, ?, ?, ?
        FROM amsusers
        WHERE userName = ?`)  
        [guestName, guestContact, guestE]
    }
    catch{

    }
}