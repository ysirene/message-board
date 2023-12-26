require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'message_board',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

exports.getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                return reject(err);
            }
            resolve(connection);
        });
    });
};
