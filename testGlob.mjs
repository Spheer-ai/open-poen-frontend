import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';

// Helper to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Convert glob to a promise-based function
const globPromise = promisify(glob);

const pattern = path.join(__dirname, 'src/**/*.tsx');
console.log(`Using glob pattern: ${pattern}`);

// Function to list all TypeScript files
const listAllFiles = async () => {
  try {
    console.log('Starting file search...');
    const files = await globPromise(pattern);

    console.log('Glob search completed.');

    if (files.length === 0) {
      console.log('No TypeScript files found.');
      return;
    }

    console.log(`Found ${files.length} files:`);
    files.forEach((file) => {
      console.log(`Found file: ${file}`);
    });
  } catch (error) {
    console.error(`Error finding files: ${error.message}`);
  }
};

listAllFiles();
