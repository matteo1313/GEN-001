import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setDownloadLink(null); // Reset the download link on file change
  };

  const onFileUpload = async () => {
    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log('Sending file:', file);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response:', response);

      if (response.ok) {
        const data = await response.json();
        console.log('File uploaded and processed:', data);
        // Construct the download link using the resultsId
        const downloadLink = `http://localhost:3001/api/download/${data.resultsId}`;
        setDownloadLink(downloadLink); // Save the download link in the state
      } else {
        console.error('Upload failed:', response.status);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="App">
      <div className="button-container">
        <input type="file" onChange={onFileChange} />
      </div>

      <div className="button-container">
        <button onClick={onFileUpload}>Upload</button>
      </div>

      {downloadLink && (
        <div className="button-container">
          <a href={downloadLink} download>Download Results</a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
