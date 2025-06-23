// deconstruct-export.js
// Usage: node scripts/deconstruct-export.js [--naming=slug|id]

const fs = require('fs/promises');
const path = require('path');

const EXPORT_FILE = path.join(__dirname, '../contentful-export/contentful-export-4falxxp6j8l4-master-2025-06-21T16-05-45.json');
const ENTRIES_DIR = path.join(__dirname, '../contentful-export/entries');
const ASSETS_FILE = path.join(__dirname, '../contentful-export/assets.json');

async function main() {
  const namingArg = process.argv.find(arg => arg.startsWith('--naming='));
  const naming = namingArg ? namingArg.split('=')[1] : 'id';

  await fs.mkdir(ENTRIES_DIR, { recursive: true });

  let raw;
  try {
    raw = await fs.readFile(EXPORT_FILE, 'utf8');
  } catch (err) {
    console.error('Could not read export file:', err.message);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Malformed export JSON:', err.message);
    process.exit(1);
  }

  // Write assets.json
  if (Array.isArray(data.assets)) {
    await fs.writeFile(ASSETS_FILE, JSON.stringify(data.assets, null, 2), 'utf8');
    console.log(`Wrote ${data.assets.length} assets to assets.json`);
  }

  // Write entries
  if (Array.isArray(data.entries)) {
    for (const entry of data.entries) {
      let filename;
      if (naming === 'slug' && entry.fields?.slug?.['en-US']) {
        filename = `${entry.fields.slug['en-US']}.json`;
      } else {
        filename = `${entry.sys.id}.json`;
      }
      try {
        await fs.writeFile(path.join(ENTRIES_DIR, filename), JSON.stringify(entry, null, 2), 'utf8');
        console.log(`Wrote entry: ${filename}`);
      } catch (err) {
        console.warn(`Failed to write entry ${filename}: ${err.message}`);
      }
    }
  }
}

main();
