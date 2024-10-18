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
    if no dup, append the filename as a new item in the database
    Doesnt return anything
*/

async function appendFileToDatabase(file) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath,'fileDatabase.json')

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
}

//A function that handles dup file name
/*  Takes in a file name , check the data base for dups
    If so, pass a message to renderer process and wait for reply
    When reply positive, return true
*/

async function handleDuplicatedFilename(filename){

}

//A function that save file into the new directory
/*  Takes in a file object and file path
    use saveAs()
*/
