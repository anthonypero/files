import { readdir, stat } from 'fs/promises';
import path from 'path';
import { writeFile } from 'fs/promises';

const BASE_URL = 'https://anthonypero.github.io/files';
const OUTPUT_FILE = 'index.html';

// Recursively walk a directory and return all non-hidden files
async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            // Skip hidden files/folders
            if (entry.name.startsWith('.')) return [];

            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? walk(res) : res;
        })
    );
    return Array.prototype.concat(...files);
}

// Escape for HTML
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Group files by folder
function groupByFolder(files) {
    const map = {};
    for (const file of files) {
        const relative = path.relative('.', file).replace(/\\/g, '/');
        const parts = relative.split('/');
        const folder =
            parts.length > 1 ? parts.slice(0, -1).join('/') : '(root)';
        if (!map[folder]) map[folder] = [];
        map[folder].push(parts.join('/'));
    }
    return map;
}

// Main
const allFiles = await walk('.');
const grouped = groupByFolder(allFiles);

let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>File Index</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    h2 { margin-top: 2rem; }
    a { display: block; margin: 0.3rem 0; word-break: break-all; }
  </style>
</head>
<body>
  <h1>Public File Index</h1>
`;

for (const folder of Object.keys(grouped).sort()) {
    html += `<h2>${escapeHTML(folder)}</h2>\n`;
    for (const file of grouped[folder].sort()) {
        const url = `${BASE_URL}/${file}`;
        const name = path.basename(file);
        html += `  <a href="${url}" target="_blank">${escapeHTML(name)}</a>\n`;
    }
}

html += `
</body>
</html>`;

await writeFile(OUTPUT_FILE, html, 'utf8');
console.log(`✅ index.html generated with ${allFiles.length} visible files`);
