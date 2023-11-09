import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null); // State to hold the download link

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setDownloadLink(null); // Reset download link on file change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response contains the file identifier for downloading
        setDownloadLink(`http://localhost:3001/api/download/${data.resultsId}`); // Set the download link
        console.log('File uploaded');
      } else {
        console.log('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {downloadLink && (
        <div>
          <a href={downloadLink} download>Download File</a>
        </div>
      )}
    </div>
  );
}

export default App;
