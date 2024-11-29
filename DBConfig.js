import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "1234", // Replace with your database password
    database: "booking_site", // Replace with your database name
});

export default db;
