const fs = require ('fs').promises;
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

async function appendFileToDatabase(file, fileContent) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath,'fileDatabase.json')
    const data = await fs.readFile(dbPath)
    const jsonData = JSON.parse(data)
    
    if (handleDuplicatedFilename(jsonData, file) === true) {
        //send ipc message back to renderer process 
    }
    else if (handleDuplicatedFilename(jsonData, file) === false) {
        // append data
        const dataEntry = parseData(file)
        jsonData.push(dataEntry)

        //save file in directory
        const filePath = path.join(userDataPath, file.name);
        const fileContent = await fs.readFile(fileContent)
        const buffer = Buffer.from(fileContent)
        fs.writeFile(filePath, buffer);

        console.log(`file saved to ${filePath}`)
        
    }
    else {
        throw new Error('There is something wrong when handling duplicate filename')
    }
    /*
    try {
        const data = await fs.readFile(dbPath, 'utf8')
        const jsonData = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT'){
            await fs.writeFile(dbPath, JSON.stringify([]), 'utf8')
        }
        else {
            throw error;
        }
    }
    */
}

//A function that handles dup file name
/*  Takes in a file name , check the data base for dups
    If so, pass a message to renderer process and wait for reply
    When reply positive, return true
*/

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


//A function that save file into the new directory
/*  Takes in a file object and file path
    use saveAs()
*/
