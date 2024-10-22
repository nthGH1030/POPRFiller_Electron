const fs = require ('fs').promises;
const { ipcRenderer } = require('electron');
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
    const dbPath = path.join(userDataPath,'fileDatabase.json')
    const data = await fs.readFile(dbPath)
    const jsonData = JSON.parse(data)
    
    if (handleDuplicatedFilename(jsonData, file) === true) {
        //send ipc message back to renderer process 
        const userConfirmation = await getUserConfirmation();
        if (userConfirmation) {

            await appendData(jsonData, file);
            await saveFile(userDataPath, file.name, fileArrayBuffer);
        }
        else {
            return
        }
        
    }
    else if (handleDuplicatedFilename(jsonData, file) === false) {
        
        //AppendData
        await appendData(jsonData, file);

        //save file in directory
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



// A function that parse tehe file into data that can be written into database
async function parseFile(file){
    const JSON = {
        filename: file.name,
        uploadDate: Date.now(),
    }
    return JSON
}

//A function that Append data
async function appendData(jsonData, file) {
    
    const dataEntry = parseFile(file)
    jsonData.push(dataEntry)
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
    const promise = new Promise((resolve) => {
        ipcRenderer.send('get-user-confirmation');

        ipcRenderer.once('user-confirmation-response', (event, userConfirmed) => {
            resolve(userConfirmed);
        })
    })

    return promise
}