// Import necessary modules
const fileUpload = require('express-fileupload');
const { runNextflow } = require('./nextflow'); // Ensure this points to your updated nextflow.js
const path = require('path');
const fs = require('fs');
const express = require('express');

function setupUploadRoute(app) {
    // Enable file upload using express-fileupload
    app.use(fileUpload());

    // POST endpoint for file upload
    app.post('/api/upload', (req, res) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        let uploadedFile = req.files.file;
        const baseFileName = path.basename(uploadedFile.name, path.extname(uploadedFile.name));
        const dateTime = new Date().toISOString().replace(/[-:.]/g, '');
        const uploadDirectory = path.resolve(__dirname, '../uploads');
        const resultsDirectory = path.resolve(__dirname, '../results'); // Results directory
        const resultsSubdirectory = `${baseFileName}_${dateTime}`;
        const uniqueResultsPath = path.join(resultsDirectory, resultsSubdirectory); // Use the results directory

        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }

        // Ensure the results directory exists
        if (!fs.existsSync(resultsDirectory)) {
            fs.mkdirSync(resultsDirectory, { recursive: true });
        }

        // Ensure the unique results path exists
        if (!fs.existsSync(uniqueResultsPath)) {
            fs.mkdirSync(uniqueResultsPath, { recursive: true });
        }

        // Save the uploaded file to the uploads directory first
        const tempUploadPath = path.join(uploadDirectory, uploadedFile.name);
        uploadedFile.mv(tempUploadPath, (err) => {
            if (err) {
                console.error('Error saving file:', err);
                return res.status(500).send('Error saving file.');
            }

            // Run the Nextflow pipeline and specify the unique results path for output
            runNextflow(tempUploadPath, uniqueResultsPath, (error, resultsZipPath) => {
                if (error) {
                    console.error('Error running Nextflow:', error);
                    return res.status(500).send('Error processing file.');
                }
                // Extract the filename from the path to use as the resultsId
                const resultsId = path.basename(resultsZipPath);
    
               // Respond with the filename as the resultsId
                res.send({ message: 'File uploaded and processed', resultsId }); // Corrected line
            });
        });
    });

    // GET endpoint for downloading zipped results
    app.get('/api/download/:resultsId', (req, res) => {
        // Extract the resultsId from the request parameters
        const resultsId = req.params.resultsId;
        // Construct the full path to the zipped results
        const resultsZipPath = path.resolve(__dirname, `../results/${resultsId}`);

        // Check if the requested zip file exists
        if (!fs.existsSync(resultsZipPath)) {
            return res.status(404).send('Results not found.');
        }

        // Set headers to signal a file download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${resultsId}`);

        // Stream the file to the client
        fs.createReadStream(resultsZipPath).pipe(res).on('finish', () => {
            // Optionally, delete the file after sending to save space
            fs.unlinkSync(resultsZipPath);
        });
    });
}

// Export the setup function
module.exports = setupUploadRoute;
