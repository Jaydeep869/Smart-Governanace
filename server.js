// importing required modules
// express for creating the server
// Pool from pg for connecting to PostgreSQL
// cors for enabling CORS (Cross-Origin Resource Sharing)
// dotenv for reading the .env file


const express = require('express');        
const { Pool } = require('pg');            
const cors = require('cors');              
require('dotenv').config();               



// creating an express app
// using cors middleware
// using json middleware
// using static middleware to serve static files from the public directory
const app = express();                     
app.use(cors());                          
app.use(express.json());                 
app.use(express.static('public'));        

// creating a new Pool instance for PostgreSQL connection
// connecting to the database using the credentials from the .env file

const pool = new Pool({
  user: process.env.DB_USER,       // Database username from .env file
  host: process.env.DB_HOST,       // Database host from .env file (where it is been hosted)
  database: process.env.DB_NAME,   // Database name from .env file
  password: process.env.DB_PASSWORD, // Database password from .env file
  port: process.env.DB_PORT,       // Database port from .env file 
});

// logging a success message if the connection is successful
// logging an error message if the connection fails

pool.connect((err, client, done) => {
    if (err) {
      console.error('Database connection error:', err.stack);
    } else {
      console.log('Database connected successfully');
    }
  });


// ===========================
// API ROUTES
// ===========================



// creating a GET route for fetching all projects from the projects table

app.get('/api/projects', async (req, res) => {
  try {
    // Query to select all records from the projects table
    const projects_data = await pool.query('SELECT * FROM projects');
    // returning the result rows in a JSON response
    res.json(projects_data.rows);
  } catch (err) {
    // returning an error with status 500 if something went wrong (500 is for internal server error)
    res.status(500).json({ error: err.message });
  }
});



// creating a POST route for receiving user feedback

app.post('/api/feedback', async (req, res) => {
  // Extracting user_name, email, and message from the request body
  const { user_name, email, message } = req.body;
  try {
    // inserting the user feedback into the feedback table in the database
    await pool.query(
      'INSERT INTO feedback (user_name, email, message) VALUES ($1, $2, $3)',
      [user_name, email, message]// passing the user_name, email, and message as parameters 
    );
    // Sending a success response if the task is completed
    res.json({ status: 'success' });
  } catch (err) {
    // Sending an error response if something went wrong
    res.status(500).json({ error: err.message });
  }
});



// creating a GET route for fetching all elections data

app.get('/api/elections', async (req, res) => {
    try {
      //Queries toselect all records from different tables used for different tiers of elections

      // National Parliamentary Elections (filtering by constituency Varanasi)
      const nationalCompleted = `
        SELECT * FROM national_parliamentary_elections 
        WHERE constituency = 'Varanasi' AND status = 'completed'
      `;
      const nationalUpcoming = `
        SELECT * FROM national_parliamentary_elections 
        WHERE constituency = 'Varanasi' AND status = 'upcoming'
      `;

      // Executing the queries
      const nationalCompletedResult = await pool.query(nationalCompleted);
      const nationalUpcomingResult = await pool.query(nationalUpcoming);
  
      // State Legislative Elections (filter by assembly_constituency  Varanasi Assembly)
      const stateCompletedQuery = `
        SELECT * FROM state_legislative_elections 
        WHERE assembly_constituency = 'Varanasi Assembly' AND status = 'completed'
      `;
      const stateUpcomingQuery = `
        SELECT * FROM state_legislative_elections 
        WHERE assembly_constituency = 'Varanasi Assembly' AND status = 'upcoming'
      `;

      // Executing the queries
      const stateCompletedResult = await pool.query(stateCompletedQuery);
      const stateUpcomingResult = await pool.query(stateUpcomingQuery);
  
      // Municipal Elections (filter by municipality Varanasi Municipal Corporation)
      const municipalCompletedQuery = `
        SELECT * FROM municipal_elections 
        WHERE municipality = 'Varanasi Municipal Corporation' AND status = 'completed'
      `;
      const municipalUpcomingQuery = `
        SELECT * FROM municipal_elections 
        WHERE municipality = 'Varanasi Municipal Corporation' AND status = 'upcoming'
      `;

      // Executing the queries
      const municipalCompletedResult = await pool.query(municipalCompletedQuery);
      const municipalUpcomingResult = await pool.query(municipalUpcomingQuery);
  
      // Panchayat Elections (filter by panchayat_name Varanasi Panchayat)
      const panchayatCompletedQuery = `
        SELECT * FROM panchayat_elections 
        WHERE panchayat_name = 'Varanasi Panchayat' AND status = 'completed'
      `;
      const panchayatUpcomingQuery = `
        SELECT * FROM panchayat_elections 
        WHERE panchayat_name = 'Varanasi Panchayat' AND status = 'upcoming'
      `;

      // Executing the queries
      const panchayatCompletedResult = await pool.query(panchayatCompletedQuery);
      const panchayatUpcomingResult = await pool.query(panchayatUpcomingQuery);
  
      // Sending the response in JSON format of different tiers of elections
      res.json({
        national: {
          completed: nationalCompletedResult.rows,
          upcoming: nationalUpcomingResult.rows,
        },
        state: {
          completed: stateCompletedResult.rows,
          upcoming: stateUpcomingResult.rows,
        },
        municipal: {
          completed: municipalCompletedResult.rows,
          upcoming: municipalUpcomingResult.rows,
        },
        panchayat: {
          completed: panchayatCompletedResult.rows,
          upcoming: panchayatUpcomingResult.rows,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }// returning an error with status 500 if something went wrong (500 is for internal server error)
  });



// creating a POST route for receiving project suggestions

app.post('/api/suggestions', async (req, res) => {
    
  // Taking project_name, email, and suggestion from the request body
    const { project_name, email, suggestion } = req.body;
    
    // If any of the required fields are missing, return an error
    if (!project_name || !email || !suggestion) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            received: { project_name, email, suggestion }
        });
    }
    
    // Inserting the suggestion into the suggestions table in the database
    try {
        const result = await pool.query(
            'INSERT INTO suggestions (project_name, email, suggestion) VALUES ($1, $2, $3) RETURNING *',// passing the project_name, email, and suggestion as parameters and returning the inserted row
            [project_name, email, suggestion]
        );
        
        res.json({ 
            status: 'success',
            data: result.rows[0]// returning the inserted row in the response
        });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ 
            error: err.message,// returning an error with status 500 if something went wrong (500 is for internal server error)
            details: err.stack // returning the error stack trace for debugging
        });
    }
});



// creating a GET route for fetching funds data

app.get('/api/funds', async (req, res) => {
  // Query to select all records from the funds table
  try {
    const result = await pool.query(
      `SELECT sector, SUM(amount) AS total_amount
       FROM funds
       GROUP BY sector`,
    );// grouping the records by sector and calculating the total amount for each sector

    res.json(result.rows);// returning the result rows in a JSON response
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });// returning an error with status 500 if something went wrong (500 is for internal server error)
  }
});


//defining the port number
//if the PORT environment variable is set, use that value, otherwise use 9000
const PORT = process.env.PORT || 9000;


// health check for deployment
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// start the server on the specified port

app.listen(PORT, (error) => {
    if (error) {
        console.log('Error starting server:', error);// giving an error message if the server fails to start
    } else {
        console.log(`Server is running on port ${PORT}`);// giving a success message if the server starts successfully
    }
});
