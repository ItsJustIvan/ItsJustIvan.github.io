// mergeToImport.js
// Usage: node scripts/mergeToImport.js [--contentType=caseStudy]

const fs = require('fs/promises');
const path = require('path');

const ENTRIES_DIR = path.join(__dirname, '../contentful-export/entries');
const OUTPUT_FILE = path.join(__dirname, '../../contentful-import.json');

async function main() {
  const contentTypeArg = process.argv.find(arg => arg.startsWith('--contentType='));
  const contentType = contentTypeArg ? contentTypeArg.split('=')[1] : null;
  console.log('Reading entries from:', ENTRIES_DIR);
  if (contentType) {
    console.log(`Filtering by contentType: ${contentType}`);
  }

  let files;
  try {
    files = await fs.readdir(ENTRIES_DIR);
  } catch (err) {
    console.error('Failed to read entries directory:', err.message);
    process.exit(1);
  }

  const entries = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const filePath = path.join(ENTRIES_DIR, file);
    let data;
    try {
      const content = await fs.readFile(filePath, 'utf8');
      data = JSON.parse(content);
    } catch (err) {
      console.warn(`Skipping malformed JSON file: ${file} (${err.message})`);
      continue;
    }
    if (!data.sys || !data.fields) {
      console.warn(`Skipping file missing sys/fields: ${file}`);
      continue;
    }
    if (contentType && data.sys.contentType?.sys?.id !== contentType) {
      continue;
    }
    entries.push(data);
  }

  const output = { entries };
  try {
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
    console.log(`Merged ${entries.length} entries into ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Failed to write output file:', err.message);
    process.exit(1);
  }
}

main();
