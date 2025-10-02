// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env.local' });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // Good practice to include port
    waitForConnections: true
});

// A quick test to see if the pool is connecting on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully!');
        connection.release(); // release the connection back to the pool
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        // If you see ECONNREFUSED here, the problem is definitely credentials or the DB server
    });

module.exports = pool;