const { contextBridge, ipcRenderer} = require('electron');


// Expose the readFileContent function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    logMessage: () => ipcRenderer.invoke('log-main-process-message'),

    loadTemplate: (templateType) => ipcRenderer.invoke('load-template', templateType),

    parseFile: (filename, templateType) => 
        ipcRenderer.invoke('parse-file-to-json', filename, templateType),

    checkForDuplicate: (newDataEntry) => 
        ipcRenderer.invoke('check-duplicate-filename-in-database', newDataEntry),
    
    getUserConfirmation: (message) => 
        ipcRenderer.invoke('get-user-confirmation', message),

    updateDatabase: (updatedDatbaseObj) => 
        ipcRenderer.invoke('update-database', updatedDatbaseObj),

    appendFileToDatabase: (dataEntry) => 
        ipcRenderer.invoke('append-data-to-database', dataEntry),

    saveTemplates: (fileArrayBuffer, filename, templateType) => 
        ipcRenderer.invoke('save-template-in-directory', fileArrayBuffer, filename, templateType),

    getFileDatabyTemplateType: (templateType) =>
        ipcRenderer.invoke('get-file-data-by-template-type', templateType),

    selectAndDeselectTemplate: (filename) =>
        ipcRenderer.invoke('select-deselect-template', filename),

    findSelected: (filename) =>
        ipcRenderer.invoke('find-selected-template', filename)

});

console.log('the preload script has run')