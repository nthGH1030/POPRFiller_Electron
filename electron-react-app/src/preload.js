const { contextBridge, ipcRenderer} = require('electron');




// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    loadTemplate: () => ipcRenderer.invoke('load-template'),

    appendFileToDatabase: (dataEntry) => 
        ipcRenderer.invoke('append-data-to-database', dataEntry),

    ensureDatabaseExist: () => 
        ipcRenderer.invoke('ensure-database-exist'),

    saveTemplates: (fileArrayBuffer) => 
        ipcRenderer.invoke('save-template-in-directory', fileArrayBuffer),

    parsefile: (file, templateType) => 
        ipcRenderer.invoke('parse-file-to-json', file, templateType),

    askUserConfirmation: (message, functionToExecute, args = []) => 
        ipcRenderer.invoke('user-confirm-action', message, functionToExecute, args)
        
});

console.log('the preload script has run')