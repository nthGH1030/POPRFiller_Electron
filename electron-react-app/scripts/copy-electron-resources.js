const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src');
const destDir = path.resolve(__dirname, '..', 'build', 'src');

// Copy the src folder to the build/src folder
fs.cpSync(srcDir, destDir, { recursive: true, force: true });