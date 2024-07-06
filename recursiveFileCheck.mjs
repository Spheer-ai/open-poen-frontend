import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing your TypeScript files
const dirPath = path.join(__dirname, 'src');
console.log(`Checking directory: ${dirPath}`);

const findFilesRecursively = (directory, extension, fileList = []) => {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFilesRecursively(filePath, extension, fileList);
    } else if (filePath.endsWith(extension)) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// Function to manually check and list .tsx files in the directory
const manualFileCheck = async () => {
  try {
    const tsxFiles = findFilesRecursively(dirPath, '.tsx');
    console.log(`Found ${tsxFiles.length} .tsx files:`);
    tsxFiles.forEach(file => {
      console.log(`Found file: ${file}`);
    });
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
  }
};

manualFileCheck();
