import React, { useState } from "react";
import Sidebar from "./layout/Sidebar";
import Workflow from "./pages/Workflow";

function App() {


  return (
    <div className="grid grid-cols-1 overflow-hidden h-screen bg-[#EDEFF4] lg:grid-cols-6">
      {/* <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {downloadLink && (
        <div>
          <a href={downloadLink} download>Download File</a>
        </div>
      )} */}
      <Sidebar />
      <Workflow />
    </div>
  );
}

export default App;
