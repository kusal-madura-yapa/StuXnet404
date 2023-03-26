// Get the button element
const downloadBtn = document.getElementById("downloadBtn");

// Add an event listener to the button
downloadBtn.addEventListener("click", () => {
  // Sample data to be downloaded
  const attendance = "attendance data";

  // Create a blob from the data
  const blob = new Blob([attendance], { type: "text/plain" });

  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);

  // Create a link element
  const link = document.createElement("a");

  // Set the link's href to the temporary URL and download attribute to the desired filename
  link.href = url;
  link.download = "Attendance.txt";

  // Click the link to initiate the download
  link.click();

  // Clean up the temporary URL
  URL.revokeObjectURL(url);
});