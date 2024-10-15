const fs = require ('fs').promises;
const path = require('path');
const app = require('electron').app;

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

//A function that creates a unique filename
function createUniqueFileName(file) {
    const originName = file.name;
    const ext = path.extname(originName)
    const baseName = path.basename(originName, ext)
    const timeStamp = Date.now() 
}