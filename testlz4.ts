import * as fs from "fs";
import * as lz4 from "lz4";
import * as path from "path";
import * as child_process from "child_process";

// Read the encrypted file
const inputFilePath = "6123.rmp.lz4";
const outputFilePath = "6123.rmp";
const extractDir = "extracted_files";

fs.readFile(inputFilePath, (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Decompress the file
  const decompressed = lz4.decode(data);

  // Write the decompressed data to a new file
  fs.writeFile(outputFilePath, decompressed, (err) => {
    if (err) {
      console.error("Error writing the file:", err);
      return;
    }

    console.log("File decompressed successfully");

    // Extract the .rmp file
    extractRMP(outputFilePath, extractDir);
  });
});

function extractRMP(filePath: string, outputDir: string) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const command = `tar -xf ${filePath} -C ${outputDir}`;
  child_process.exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("Error extracting the .rmp file:", err);
      return;
    }

    console.log("File extracted successfully");
    console.log(stdout);
  });
}
