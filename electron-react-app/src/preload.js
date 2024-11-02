const { contextBridge, ipcRenderer} = require('electron');
const { saveTemplates } = require('./utils/manageUserData');



// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    loadTemplate: () => ipcRenderer.invoke('load-template'),

    appendFileToDatabase: (file, fileArrayBuffer) => 
        ipcRenderer.invoke('append-data-to-database', dataEntry, databaseFilepath),

    ensureDatabaseExist: () => 
        ipcRenderer.invoke('ensure-database-exist', filename, databaseDirectory),

    saveTemplates: () => 
        ipcRenderer.invoke('save-template-in-directory', fileArrayBuffer, fileDirectory),
        
});

console.log('the preload script has run')