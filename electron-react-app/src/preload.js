const { contextBridge, ipcRenderer} = require('electron');
//const fs = require('fs');
const path = require('path');

/*
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
*/

// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    loadTemplatePO: () => ipcRenderer.invoke('load-template-po'),
    loadTemplatePR: () => ipcRenderer.invoke('load-template-pr'),
});

console.log('the preload script has run')