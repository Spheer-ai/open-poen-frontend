import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing your TypeScript files
const dirPath = path.join(__dirname, 'src'); // Adjusted to 'src' based on your structure

console.log(`Scanning directory: ${dirPath}`);

// Function to list all TypeScript files
const listAllFiles = async () => {
  try {
    const pattern = path.join(dirPath, '**/*.tsx');
    console.log(`Using glob pattern: ${pattern}`);

    console.log('Starting file search...');
    glob(pattern, (err, files) => {
      if (err) {
        console.error(`Error finding files: ${err.message}`);
        return;
      }

      console.log('File search completed.');
      
      if (files.length === 0) {
        console.log('No TypeScript files found.');
        return;
      }

      console.log(`Found ${files.length} files:`);
      files.forEach((file) => {
        console.log(`Found file: ${file}`);
      });
    });
  } catch (error) {
    console.error(`Error processing files: ${error.message}`);
  }
};

listAllFiles();
