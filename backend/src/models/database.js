import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a connection pool
// A pool is better than a single connection for handling multiple concurrent requests
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'DontTellYou5!',
  database: process.env.DB_NAME || 'teams_clone',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection (optional, but good for debugging)
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to MySQL database.');
    connection.release();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.stack);
  }
}

testConnection();

// Export the pool so you can use it in your other files (like auth.routes.js)
export default pool;
