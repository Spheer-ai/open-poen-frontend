import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

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

// Function to revert image imports in .tsx files
const revertImageImports = async () => {
  const tsxFiles = findFilesRecursively(dirPath, '.tsx');
  console.log(`Found ${tsxFiles.length} .tsx files:`);

  for (const file of tsxFiles) {
    console.log(`Processing file: ${file}`);

    const fileStream = fs.createReadStream(file);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    const lines = [];
    let importFound = false;

    for await (const line of rl) {
      if (line.startsWith('import {') && line.includes('} from "../../utils/images";')) {
        // Skip the specific imports added by the previous script
        continue;
      } else if (line.includes('useCachedImages')) {
        // Restore the original import statement
        importFound = true;
        lines.push('import useCachedImages from "../../utils/images";');
      } else {
        lines.push(line);
      }
    }

    if (importFound) {
      console.log(`Reverting changes in: ${file}`);
      // Write the updated lines back to the file
      fs.writeFileSync(file, lines.join('\n'));
    }

    rl.close();
    fileStream.close();
  }
};

revertImageImports();
