const fs = require ('fs').promises;
const {dialog } = require('electron');
const path = require('path');
const app = require('electron').app;

const userDataPath = app.getPath('userData')
const databaseDirectory = path.join(userDataPath,'Database')
const databasePath = path.join(databaseDirectory,'userDatabase.json')

async function ensureDatabaseExist(){

    try {
        await fs.access(databasePath)
        return 'There is already an existing database'

    } catch(err) {
        if(err.code === 'ENOENT') {
            await fs.mkdir(databaseDirectory, {recursive: true});
            await fs.writeFile(databasePath, '[]')
            return 'database has been created'
        } else {
            return `Error: ${err}, There is an error in creating the database`
        }
    }
}

async function getDatabaseAsObj() {

    const databaseBuffer = await fs.readFile(databasePath);
    const databaseObj = JSON.parse(databaseBuffer);

    return databaseObj
}


// A function that parse the file into data that can be written into database
async function parseFile(filename, templateType){
    const JSON = {
        filename: filename,
        uploadDate: Date.now(),
        templateType: templateType,
        status: "unselected"
    }
    console.log('parsed DataEntry :', JSON)
    return JSON
}

async function checkForDuplicate(newDataEntry) {
    
    const databaseObj = await getDatabaseAsObj()
    let foundDuplicate = false

    const updatedDatabaseObj = databaseObj.map(entry => {

        if (entry.filename === newDataEntry.filename) {
            foundDuplicate = true;
            return newDataEntry
        }
        return entry;
    })

    return foundDuplicate ? updatedDatabaseObj : null;
}


// A function that gets user confirmation and execute function passed in
async function getUserConfirmation(message) {

    const result = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm',
      message: message,
    });
    
    if (result.response === 0) {
        return 'Yes'
    } else {
        return 'No'
    }
  }

//Update the database
async function updateDatabase(updatedDatabaseObj) {

    const newDataInJSONString = JSON.stringify(updatedDatabaseObj, null, 2)

    try { 
        await fs.writeFile(databasePath, newDataInJSONString)
        return {success: true}

    } catch(error) {
        return { success: false, error: error.message };
    }
    
}

//append to database
async function appendtoDatabase(dataEntry) {
    try {
        const databaseObj = await getDatabaseAsObj()
        databaseObj.push(dataEntry)
    
        const newDataInJSONString = JSON.stringify(databaseObj, null, 2)
        await fs.writeFile(databasePath, newDataInJSONString)

        return {success: true}

    } catch(error) {

        return { success: false, error: error.message };
    }
}


// Ensure template directory exists
async function ensureTemplateDirectoryExist(templateType) {

    const userTemplateDirectory = path.join(userDataPath, 'UserUploadedTemplate' ,templateType)

    try {
        await fs.access(userTemplateDirectory)
        return 'There is already an existing database'

    } catch(err) {
        if(err.code === 'ENOENT') {
            await fs.mkdir(userTemplateDirectory, {recursive: true});

            return 'Template Directory has been created'
        } else {
            return `Error: ${err}, There is an error in creating template directory`
        }
    }
}

//Save database in destination
async function saveTemplates(fileBufferArray, filename, templateType) {

    const userTemplateDirectory = path.join(userDataPath, 'UserUploadedTemplate', templateType)
    const savePath = path.join(userTemplateDirectory, filename)
    const buffer = Buffer.from(fileBufferArray)
    try { 
        await fs.writeFile(savePath, buffer)
        return {success: true}
        
    } catch(error) {

        return { success: false, error: error.message };
    }
}


async function getFileDatabyTemplateType(templateType) {
    try {
        const databaseObj = await getDatabaseAsObj()
        
        const filteredData = databaseObj.filter(
            entry => entry.templateType === templateType);
            
        return filteredData   
    } catch(error) {
        return {error: error.message}
    }
}

async function selectAndDeselectTemplate(filename, templateType) {
    const databaseObj = await getDatabaseAsObj()

    const selectedObj = databaseObj.find(entry => entry.filename === filename)
    if (selectedObj) {
        //select the entry
        selectedObj.status = 'selected';

        //deselect the other entry
        databaseObj.forEach(entry => {
            if (entry.filename !== filename && entry.templateType === templateType) {
                entry.status = 'unselected';
            }
        })

        // Write the updated database back to the file
        await fs.writeFile( databasePath, JSON.stringify(databaseObj, null, 2));

        return {success: true}

    } else {
        return { success: false };
    }
}

async function deselectAllTemplate(templateType){

    const databaseObj = await getDatabaseAsObj()
    const newDatabaseObj = databaseObj.map(entry => {
        if (entry.templateType === templateType && entry.status === 'selected') {
          entry.status = 'unselected';
        }
        return entry;
      });
    try {
        await fs.writeFile( databasePath, JSON.stringify(newDatabaseObj, null, 2));
        return {success: true}

    } catch(error) {
        return {success: false, error: error.message}
    }

}

async function findTemplate(filename) {
    const databaseObj = await getDatabaseAsObj()
    const requestedObj = databaseObj.find(entry => entry.filename === filename)
    if (requestedObj) {

        return requestedObj
    } 
}

async function findSelectedTemplate(templateType){
    const databaseObj = await getDatabaseAsObj()

    const selectedTemplateObj = databaseObj.find(entry => entry.status === 'selected' && 
        entry.templateType === templateType)

    return selectedTemplateObj
}

module.exports = {
    
    ensureDatabaseExist,
    getDatabaseAsObj,
    parseFile,
    appendtoDatabase,
    updateDatabase,
    checkForDuplicate,
    getUserConfirmation,
    ensureTemplateDirectoryExist,
    saveTemplates,
    getFileDatabyTemplateType,
    selectAndDeselectTemplate,
    deselectAllTemplate,
    findTemplate,
    findSelectedTemplate,

};