const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

// Function to read file content
const readFileContent = (filePath) => {
  try {
    const content = fs.readFileSync(path.join(__dirname, filePath));
    return content;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
};

// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  loadTemplatePO: () => readFileContent('./secrets/template PO.xlsx'),
  loadTemplatePR: () => readFileContent('./secrets/template PR.xlsx'),
  // Expose a method to get the file content as a Buffer
  getFileBuffer: (filePath) => readFileContent(filePath)
});

console.log('the preload script has run')