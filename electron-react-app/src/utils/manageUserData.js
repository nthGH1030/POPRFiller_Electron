const fs = require ('fs').promises;
const {dialog } = require('electron');
const path = require('path');
const app = require('electron').app;

//A function that checks if the directory exists, else creates it
async function ensureDirectoryExists(folderName) {
    const userDataPath = app.getPath('userData')
    const filePath = path.join(userDataPath, folderName)
    try {
        await fs.mkdir(filePath, {recursive: true});
        console.log(`Directory ${filePath} is created or already exist`)
    } catch {
        console.log(error, 'Failed to create directory');
    }
}

//A function that append a uploaded file to a JSON database 
/*  Takes in a file object
    Get the path to the JSON DB
    Use check dupfile function to check for dups
        if no dup, 
            append the filename as a new item in the database
            save the user file into the target directory
        if dup,
            send an ipc message to renderer and ask for confirmation
            wait for user confirmation (A promise)
            when promise fullfilled, conduct write file operation & replace the data in database
    Doesnt return anything
*/

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
            await updateData(jsonData, file);
            const updatedData = JSON.stringify(jsonData, null, 2);
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
    
    const updatedData = {...jsonData};
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

    return updatedData


}


//A function that save file into the new directory
async function saveFile(userDataPath, filename, fileArrayBuffer) {
    const buffer = Buffer.from(fileArrayBuffer)
    const filePath = path.join(userDataPath, filename);
    await fs.writeFile(filePath, buffer);

    console.log(`file saved to ${filePath}`)
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


module.exports = {
    appendFileToDatabase,
    ensureDirectoryExists,

};