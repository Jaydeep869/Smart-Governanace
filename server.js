// =======================
// IMPORT REQUIRED MODULES
// =======================
const express = require('express');        // Import Express framework for building web servers
const { Pool } = require('pg');            // Import PostgreSQL client for Node.js
const cors = require('cors');              // Import CORS middleware to handle cross-origin requests
require('dotenv').config();                // Load environment variables from .env file

// ======================
// INITIALIZE EXPRESS APP
// ======================
const app = express();                     // Create an instance of the Express application
app.use(cors());                          // Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(express.json());                  // Parse incoming JSON request bodies
app.use(express.static('public'));        // Serve static files from the "public" directory (e.g., frontend files)

// ============================
// DATABASE CONNECTION (pg Pool)
// ============================
const pool = new Pool({
  user: process.env.DB_USER,       // Database username from .env file
  host: process.env.DB_HOST,       // Database hoyour_postgres_passwordst (e.g., localhost) from .env file
  database: process.env.DB_NAME,   // Database name from .env file
  password: process.env.DB_PASSWORD, // Database password from .env file
  port: process.env.DB_PORT,       // Database port (usually 5432 for PostgreSQL) from .env file
});
pool.connect((err, client, done) => {
    if (err) {
      console.error('Database connection error:', err.stack);
    } else {
      console.log('Database connected successfully');
    }
  });

// ===========================
// API ROUTE: GET /api/projects
// ===========================
// Fetches all projects from the 'projects' table
app.get('/api/projects', async (req, res) => {
  try {
    // Query to select all records from the 'projects' table
    const result = await pool.query('SELECT * FROM projects');
    // Return the result rows as a JSON response
    res.json(result.rows);
  } catch (err) {
    // Return an error response with status 500 if something goes wrong
    res.status(500).json({ error: err.message });
  }
});

// ===========================
// API ROUTE: POST /api/feedback
// ===========================
// Receives user feedback and stores it in the 'feedback' table
app.post('/api/feedback', async (req, res) => {
  // Destructure user input from the request body
  const { user_name, email, message } = req.body;
  try {
    // Insert feedback into the database using parameterized query to prevent SQL injection
    await pool.query(
      'INSERT INTO feedback (user_name, email, message) VALUES ($1, $2, $3)',
      [user_name, email, message]
    );
    // Send a success response back to the client
    res.json({ status: 'success' });
  } catch (err) {
    // Send an error response if the database operation fails
    res.status(500).json({ error: err.message });
  }
});


// for election 
app.get('/api/elections',async(req,res)=>{
    try {
        const electionResult = await pool.query(`SELECT * FROM elections`);
        res.json(electionResult.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// =========================================
// (Optional) ADD MORE ROUTES FOR OTHER DATA
// =========================================
// Example for /api/services, /api/elections, etc. can be added similarly

// ==============================
// START THE SERVER ON SPECIFIED PORT
// ==============================
const PORT = process.env.PORT || 9000;

app.listen(PORT, (error) => {
    if (error) {
        console.log('Error starting server:', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});