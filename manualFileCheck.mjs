import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, 'src');
console.log(`Checking directory: ${dirPath}`);

// Function to manually check and list files in the directory
const manualFileCheck = async () => {
  try {
    const items = await fs.readdir(dirPath);
    console.log(`Found ${items.length} items in ${dirPath}:`);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);
      if (stat.isDirectory()) {
        console.log(`Directory: ${itemPath}`);
        const subItems = await fs.readdir(itemPath);
        subItems.forEach(subItem => {
          console.log(`  SubItem: ${path.join(itemPath, subItem)}`);
        });
      } else {
        console.log(`File: ${itemPath}`);
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${error.message}`);
  }
};

manualFileCheck();
