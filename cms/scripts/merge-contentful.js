// merge-contentful.js
// Usage: node scripts/merge-contentful.js

const fs = require('fs/promises');
const path = require('path');

const EXPORT_DIR = path.join(__dirname, '../contentful-export');
const ENTRIES_DIR = path.join(EXPORT_DIR, 'entries');
const OUTPUT_FILE = path.join(__dirname, '../contentful-import.json');

async function readJson(file) {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function main() {
  // Read content-types, assets, metadata
  const contentTypes = await readJson(path.join(EXPORT_DIR, 'content-types.json')) || [];
  const assets = await readJson(path.join(EXPORT_DIR, 'assets.json')) || [];
  const metadata = await readJson(path.join(EXPORT_DIR, 'metadata.json')) || {};

  // Read entries
  let files = [];
  try {
    files = await fs.readdir(ENTRIES_DIR);
  } catch (err) {
    console.error('Could not read entries dir:', err.message);
    process.exit(1);
  }

  const entries = [];
  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const entry = await readJson(path.join(ENTRIES_DIR, file));
    if (!entry) {
      console.warn(`Skipping malformed entry: ${file}`);
      continue;
    }
    // Assign a sys.id if missing (for new manual entries)
    if (!entry.sys?.id) {
      entry.sys = entry.sys || {};
      entry.sys.id = 'local_' + Math.random().toString(36).slice(2, 10);
      entry.sys.type = 'Entry';
    }
    entries.push(entry);
  }

  const output = {
    contentTypes,
    entries,
    assets,
    metadata
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Merged ${entries.length} entries into ${OUTPUT_FILE}`);
}

main();
