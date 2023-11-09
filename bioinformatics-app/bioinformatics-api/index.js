// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path'); // Add path module for file paths

// Create an Express app
const app = express();

// Set up cors to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON and urlencoded data
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Set a port for the server to listen on
const PORT = process.env.PORT || 3001;

// Define a sample route for the root path
app.get('/', (req, res) => {
  res.send('Hello, bioinformatics-api!');
});

// Import the upload route setup function
const setupUploadRoute = require('./routes/upload');

// Set up the /api/upload route using the setupUploadRoute function
setupUploadRoute(app);

// Static route to serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route for undefined routes, returning a 404 status
app.use('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
