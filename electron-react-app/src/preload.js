const { contextBridge, ipcRenderer} = require('electron');

// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    loadTemplatePO: () => ipcRenderer.invoke('load-template-po'),
    loadTemplatePR: () => ipcRenderer.invoke('load-template-pr'),
});

console.log('the preload script has run')