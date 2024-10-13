const { contextBridge, ipcRenderer} = require('electron');


// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    loadTemplate: () => ipcRenderer.invoke('load-template'),
});

console.log('the preload script has run')