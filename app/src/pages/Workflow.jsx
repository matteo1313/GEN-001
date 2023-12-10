import React, { useState } from "react";

const Workflow = () => {
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
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response contains the file identifier for downloading
        setDownloadLink(`http://localhost:3001/api/download/${data.resultsId}`); // Set the download link
        setSelectedFile(null);
        console.log("File uploaded");
      } else {
        console.log("Error uploading file");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="lg:col-span-5 min-h-screen p-[25px]">
      <h1 className="text-[20px] font-[700]">Workflow Analysis</h1>
      <div className=" h-full w-full flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          style={{
            boxShadow: "0px -0.743px 0.743px 0px rgba(13, 34, 71, 0.12) inset",
            filter:
              "drop-shadow(0px 20.799px 80.224px rgba(13, 34, 71, 0.10)) drop-shadow(0px 14.856px 29.713px rgba(13, 34, 71, 0.10)) drop-shadow(0px 0.743px 5.943px rgba(13, 34, 71, 0.12))",
          }}
          className="lg:w-[750px] rounded-lg flex flex-col items-center justify-center gap-[100px] lg:h-[700px] bg-[#fff] "
        >
          <input
            type="file"
            name="upload"
            id="upload"
            required
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="upload"
            className="flex cursor-pointer items-center justify-center px-[20px] gap-[8px] py-[8px] rounded-[8px] text-white bg-black"
          >
            Upload{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M15.75 11.25V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V11.25"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.75 6L9 2.25L5.25 6"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 2.25V11.25"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </label>
          <div className="flex  justify-center w-full">
            <div className="flex flex-col items-center">
              <div className="rounded-[12px] box_custom">P</div>
              <p className="text-[14px] w-[54px] text-center font-[500] mt-2">
                Porechop
              </p>
            </div>
            <div className="w-[106px] h-[2px] mt-[26px] opacity-10 bg-black"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-[12px] box_custom">F</div>
              <p className="text-[14px] text-center font-[500] mt-2">
                Filtlong
              </p>
            </div>
            <div className="w-[106px] h-[2px] mt-[26px] opacity-10 bg-black"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-[12px] box_custom">S</div>
              <p className="text-[14px] text-center font-[500] mt-2">Seqtk</p>
            </div>
            <div className="w-[106px] h-[2px] mt-[26px] opacity-10 bg-black"></div>
            <div className="flex flex-col items-center">
              <div className="rounded-[12px] box_custom">F</div>
              <p className="text-[14px] text-center font-[500] mt-2">Flye</p>
            </div>
          </div>
          <div className="flex items-center gap-[100px]">
            {selectedFile !== null ? (
              <button
                type="submit"
                className="flex items-center justify-center px-[20px] gap-[8px] py-[8px] rounded-[8px] text-white bg-black"
              >
                Upload Now
              </button>
            ) : (
              <button
                disabled
                className="flex items-center justify-center px-[20px] gap-[8px] py-[8px] rounded-[8px] text-white bg-gray-400"
              >
                Upload Now
              </button>
            )}
            {downloadLink !== null && (
              <a
                href={downloadLink}
                target="_blank"
                className="flex cursor-pointer items-center justify-center px-[20px] gap-[8px] py-[8px] rounded-[8px] text-white bg-black"
              >
                Download File
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Workflow;
