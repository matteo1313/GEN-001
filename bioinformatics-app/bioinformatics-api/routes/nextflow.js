
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver'); // Require the archiver module for zipping

// Function to run the Nextflow pipeline and zip the results
function runNextflow(inputFile, outputDir, callback) {
  const nextflowScript = path.join(__dirname, '../scripts/porechop_filtlong_flye.nf');

  // Ensure that the output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Build the Nextflow command
  const command = `nextflow run ${nextflowScript} --input_file '${inputFile}' --output_dir '${outputDir}'`;

  console.log(`Executing command: ${command}`); // Log the command to be executed

  // Execute the Nextflow script from the 'scripts' directory
  exec(command, { cwd: path.dirname(nextflowScript) }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Nextflow: ${error}`);
      return callback(error);
    }

    console.log(`Nextflow stdout: ${stdout}`);
    console.error(`Nextflow stderr: ${stderr}`);

    // If Nextflow execution is successful, proceed to zip the results
    zipResults(outputDir, (zipError) => {
      if (zipError) {
        console.error(`Error zipping the results: ${zipError}`);
        return callback(zipError);
      }

      // If zipping is successful, call the callback with no error and the path to the zipped file
      callback(null, `${outputDir}.zip`);
    });
  });
}

// Function to zip the results directory
function zipResults(outputDir, zipCallback) {
  // Create a file to stream archive data to.
  const output = fs.createWriteStream(`${outputDir}.zip`);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
  });

  // Listen for all archive data to be written
  output.on('close', () => {
    console.log(`Archive completed, total bytes: ${archive.pointer()}`);
    zipCallback(null); // No error, zipping completed successfully
  });

  // Good practice to catch warnings (like stat failures and other non-blocking errors)
  archive.on('warning', (warn) => {
    console.warn(`Warning during archiving: ${warn}`);
    zipCallback(warn); // Pass the warning to the callback
  });

  // Good practice to catch this error explicitly
  archive.on('error', (err) => {
    console.error(`Error during archiving: ${err}`);
    zipCallback(err); // Pass the error to the callback
  });

  // Pipe archive data to the file
  archive.pipe(output);

  // Append files from a directory
  archive.directory(outputDir, false);

  // Finalize the archive (i.e., finish appending files and seal the archive)
  archive.finalize();
}

module.exports = { runNextflow };