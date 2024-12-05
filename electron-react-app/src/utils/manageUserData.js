const fs = require ('fs').promises;
const {dialog } = require('electron');
const path = require('path');
const app = require('electron').app;


async function ensureDatabaseExist(){
    const userDataPath = app.getPath('userData')
    const databaseDirectory = path.join(userDataPath,'Database')
    const filePath = path.join(databaseDirectory,'userDatabase.json');

    try {
        fs.access(filePath)
        return 'There is already an existing database'

    } catch(err) {
        if(err === 'ENOENT') {
            await fs.mkdir(filePath, {recursive: true});
            await fs.writeFile(filePath, '[]')
            return 'database has been created'
        } else {
            return 'There is an error in creating the database'
        }
    }
}


// A function that parse the file into data that can be written into database
async function parseFile(file, templateType){
    const JSON = {
        filename: file.name,
        uploadDate: Date.now(),
        templateType: templateType,
        status: "unselected"
    }
    console.log('parsed DataEntry :', JSON)
    return JSON
}

async function checkForDuplicate(newDataEntry) {
    const userDataPath = app.getPath('userData')
    const databaseFilepath = path.join(userDataPath,'Database','fileDatabase.json')
    const databaseBuffer = await fs.readFile(databaseFilepath);
    const databaseObj = JSON.parse(databaseBuffer);
    let foundDuplicate = false

    const updatedDatabaseObj = databaseObj.map(entry => {
        if (entry.filename === newDataEntry.filename) {
            foundDuplicate = true;
            return {...entry, ...newDataEntry}
        }
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
    const userDataPath = app.getPath('userData')
    const databaseDirectory = path.join(userDataPath,'Database')
    const filePath = path.join(databaseDirectory,'userDatabase.json');
    const newDataInJSONString = JSON.stringify(updatedDatabaseObj, null, 2)

    try { 
        await fs.writeFile(filePath, newDataInJSONString)
        return {success: true}

    } catch(error) {
        return { success: false, error: error.message };
    }
    
}

//append to database
async function appendtoDatabase(dataEntry) {
    try {
        const userDataPath = app.getPath('userData')
        const databaseFilepath = path.join(userDataPath,'Database','fileDatabase.json')
    
        const databaseBuffer = await fs.readFile(databaseFilepath);
        const databaseObj = JSON.parse(databaseBuffer);
        databaseObj.push(dataEntry)
    
        const newDataInJSONString = JSON.stringify(databaseObj, null, 2)
        await fs.writeFile(databaseFilepath, newDataInJSONString)

        return {success: true}

    } catch(error) {

        return { success: false, error: error.message };
    }
}

async function getFileDatabyTemplateType(templateType) {
    try {

        const userDataPath = app.getPath('userData')
        const databaseFilepath = path.join(userDataPath,'Database','fileDatabase.json')
        const databaseBuffer = await fs.readFile(databaseFilepath);
        const databaseObj = JSON.parse(databaseBuffer);
        
        const filteredData = databaseObj.filter(
            entry => entry.templateType === templateType);
            
        return filteredData   
    } catch(error) {
        return {error: error.message}
    }
}

async function selectAndDeselectTemplate(filename) {
    const userDataPath = app.getPath('userData')
    const databaseFilepath = path.join(userDataPath,'Database','fileDatabase.json')
    const databaseBuffer = await fs.readFile(databaseFilepath);
    const databaseObj = JSON.parse(databaseBuffer);

    const selectedObj = databaseObj.find(entry => entry.filename === filename)
    if (selectedObj) {
        //select the entry
        selectedObj.status = 'selected';

        //deselect the other entry
        databaseObj.forEach(entry => {
            if (entry.filename != filename) {
                entry.status = 'unselected';
            }
        })
        // Write the updated database back to the file
        await fs.writeFile(databaseFilepath, JSON.stringify(databaseObj, null, 2));
        
        return 'file select is successful'

    } else {
        return 'No such file is found in the database'
    }

}

// Ensure template directory exists
async function ensureTemplateDirectoryExist(templateType) {
    const userDataPath = app.getPath('userData')
    const fileDirectory = path.join(userDataPath, 'UserUploaded' ,templateType)

    try {
        fs.access(fileDirectory)
        return 'There is already an existing database'

    } catch(err) {
        if(err === 'ENOENT') {
            await fs.mkdir(fileDirectory, {recursive: true});

            return 'Template Directory has been created'
        } else {
            return 'There is an error in creating template directory'
        }
    }
}

//Save database in destination
async function saveTemplates(fileBufferArray, templateType) {

    const userDataPath = app.getPath('userData')
    const templateDirectory = path.join(userDataPath, 'UserUploaded', templateType)
    
    try { 
        await fs.writeFile(fileBufferArray, templateDirectory)
        return {success: true}
        
    } catch(error) {

        return { success: false, error: error.message };
    }
}

module.exports = {
    
    ensureDatabaseExist,
    parseFile,
    appendtoDatabase,
    updateDatabase,
    checkForDuplicate,
    getUserConfirmation,
    ensureTemplateDirectoryExist,
    saveTemplates

};