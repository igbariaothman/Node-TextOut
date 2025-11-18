const fs = require("fs");
const path = require("path");

// Path to the folder containing the input files
const folderPath = path.join(__dirname, "text");
// Path to the output file
const outputFile = path.join(__dirname, "text/output.txt");

// Delete output file if it already exists
if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

// List of file names to read
const fileNames = ["1.txt", "2.txt", "3.txt"];

// Reads text and returns an array of lines (keeps structure)
function readLinesKeep(text) {
  const arr = text.split(/\r?\n/);
  if (arr.length && arr[arr.length - 1] === "") arr.pop(); // Remove last empty line
  return arr;
}

// Load each file: store its lines and current reading index
const files = fileNames.map((name) => {
  const p = path.join(folderPath, name);
  if (!fs.existsSync(p)) {
    console.log(`The file ${name} doesn't exist in folder "text"`);
    return { name, lines: [], idx: 0 };
  }
  const content = fs.readFileSync(p, "utf8");
  return { name, lines: readLinesKeep(content), idx: 0 };
});

// Copy 'count' lines from a file into the output
function copyUpTo(file, count, sink) {
  if (file.idx >= file.lines.length) return 0; // No more lines
  const start = file.idx;
  const end = Math.min(file.idx + count, file.lines.length);
  let chunk = "";
  for (let i = start; i < end; i++) chunk += file.lines[i] + "\n";
  sink(chunk); // Write chunk into output
  file.idx = end; // Update reading index
  return end - start;
}

let step = 1; // How many lines to copy from each file per round

// Loop until all files are fully read
while (files.some((f) => f.idx < f.lines.length)) {
  for (const f of files) {
    copyUpTo(f, step, (chunk) => fs.appendFileSync(outputFile, chunk));
  }
  step++; // Increase step each round
}

console.log("The output file created successfully");
