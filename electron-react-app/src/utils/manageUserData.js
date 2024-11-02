const fs = require ('fs').promises;
const {dialog } = require('electron');
const path = require('path');
const app = require('electron').app;


async function ensureDatabaseExist(filename, databaseDirectory){
    const filePath = path.join(databaseDirectory,filename);
    try {
        fs.access(filePath)
    } catch(err) {
        if(err === 'ENOENT') {
            await fs.mkdir(filePath, {recursive: true});
            await fs.writeFile(filePath, '[]')
            console.log('database has been created')
        } else {
            console.log('There is an error in creating the database')
        }
    }
}

// A function that parse the file into data that can be written into database
async function parseFile(file){
    const JSON = {
        filename: file.name,
        uploadDate: Date.now(),
    }
    console.log('parsed DataEntry :', JSON)
    return JSON
}

async function appendtoDatabase(dataEntry, databaseFilepath) {
    const databaseBuffer = await fs.readFile(databaseFilepath);
    const databaseObj = JSON.parse(databaseBuffer);
    databaseObj.push(dataEntry)
    console.log('Database after append: ', databaseObj)

    const newDataInJSONString = JSON.stringify(databaseObj, null, 2)
    await fs.writeFile(databaseFilepath, newDataInJSONString)
}

async function updateDatabase(newDataEntry, databaseFilepath) {
    const databaseBuffer = await fs.readFile(databaseFilepath);
    const databaseObj = JSON.parse(databaseBuffer);
    const updatedDatabaseObj = databaseObj.map(entry => {
        if (entry.filename === newDataEntry.filename) {
            return {...entry, ...newDataEntry}
        }
    })
    console.log('Database after update', updatedDatabaseObj)

    const newDataInJSONString = JSON.stringify(updatedDatabaseObj, null, 2)
    await fs.writeFile(databaseFilepath, newDataInJSONString)
}

// A function that send IPC message to renderer process
async function getUserConfirmation() {
    const result = await dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: 'Do you want to replace the existing file?'
    });
    return result.response === 0; // 0 is the index of the 'Yes' button
}

async function saveTemplates(fileBufferArray, fileDirectory) {
    
    try { await fs.writeFile(fileBufferArray, fileDirectory)
    } catch(error) {

        console.log('Failed to save template in directory. Error: ', error)
    }
}





/*
async function appendFileToDatabase(file, fileArrayBuffer) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath,'Database','fileDatabase.json')
    const data = await fs.readFile(dbPath)
    const jsonData = JSON.parse(data)
    
    if (handleDuplicatedFilename(jsonData, file) === true) {
        //send ipc message back to renderer process 
        const userConfirmation = await getUserConfirmation();
        if (userConfirmation) {

            //Update Database
            //!!!! you cant change a const, & you need to figure out what is stringify doing
            const updatedData = await updateData(jsonData, file);
            await fs.writeFile(dbPath, updatedData);
            //Save the new template in the directory
            await saveFile(userDataPath, file.name, fileArrayBuffer);
        }
        else {
            return
        }
        
    }
    else if (handleDuplicatedFilename(jsonData, file) === false) {
        
        //Update Database
        //!!!!!! not yet updated
        await updateData(jsonData, file);
        //Save the new template in the directory
        await saveFile(userDataPath, file.name, fileArrayBuffer);
        
    }

    else {
        throw new Error('There is something wrong when handling duplicate filename')
    }
}

//A function that check dup file name
async function handleDuplicatedFilename(jsonData, file){
    
    const duplicate = jsonData.find((item) => item.filename === file.filename)

    return duplicate != undefined ? true : false;
}

// A function that parse the file into data that can be written into database
async function parseFile(file){
    const JSON = {
        filename: file.name,
        uploadDate: Date.now(),
    }
    return JSON
}

//A function that Append data if it does exist, update it if it does
async function updateData(jsonData, file) {

    //!!! figure out what is a shallow copy
    let updatedData = {...jsonData};
    const dataEntry = parseFile(file)
    const existingIndex = jsonData.findIndex((entry) => entry.filename === file.name);
    
    //If no match is returned
    if (existingIndex === -1) {
        updatedData.push(dataEntry)
    }
    else {
        //if match is found
        updatedData[existingIndex] = dataEntry
    }

    const stringifiedUpdatedData = JSON.stringify(updatedData, null, 2);
    return stringifiedUpdatedData

}
*/

module.exports = {
    
    ensureDatabaseExist,
    parseFile,
    appendtoDatabase,
    updateDatabase,
    getUserConfirmation,
    saveTemplates

};