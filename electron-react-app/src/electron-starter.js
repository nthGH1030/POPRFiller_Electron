const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url')
const fs = require('fs').promises;
const log = require('electron-log');
const { toArrayBuffer } = require('./utils/Parser_toArrayBuffer');
const {ensureDatabaseExist, parseFile, appendtoDatabase, 
      updateDatabase, checkForDuplicate ,getUserConfirmation, ensureTemplateDirectoryExist,
      saveTemplates} 
      = require('./utils/manageUserData');


//-------------------------------handle logging----------------------------------
// Configure electron-log
log.transports.file.resolvePath = () => path.join(path.dirname(app.getPath('exe')), 'app.log');

// Logging function
function logToFile(message) {
  log.info(message);
}

//-------------------------------handle squirrel events----------------------------------
// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  
  if (process.argv.length === 1) {
    return false;
  }
  
  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
      //logToFile(`--squirrel-install: ${process.argv}`)
      
      
    case '--squirrel-updated':
      //logToFile(`--squirrel-updated: ${process.argv}`)
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;
      
      case '--squirrel-firstrun':
        //logToFile(`--squirrel-firstrun: ${process.argv}`)
        break

    case '--squirrel-uninstall':
      //logToFile(`--squirrel-uinstalled: ${process.argv}`)
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      
      app.quit();
      return true;
  }
};

//---------------Debug tool---------------------//

ipcMain.handle('log-main-process-message' , async (event) => {
  const databaseExist = await ensureDatabaseExist()
  const POdirectoryExist = await ensureTemplateDirectoryExist('PO')
  const PRdirectoryExist = await ensureTemplateDirectoryExist('PR')
  const userDataPath = app.getPath('userData')
  return [`Message: ${userDataPath}, ${databaseExist}, ${POdirectoryExist}, ${PRdirectoryExist}`]
})

//-------------------functions to be exposed in renderer process--------------------------
const templatePaths = {
  'PO': './secrets/template PO.xlsx',
  'PR': './secrets/template PR.xlsx',
}

// Read a given file path and return its content in buffer array
async function readFileToBufferArray(filePath) {
    try {
        let content = await fs.readFile(filePath);
        toArrayBuffer(content);
        return content;
    } catch (error) {
        console.error('Failed to read file:', error);
        throw error; 
    }
}

// Load template PO from backend and return it as bufferArray
ipcMain.handle('load-template', async (event , templateType) => {
  const templatePath = path.join(__dirname, templatePaths[templateType]);
  const content = await readFileToBufferArray(templatePath);
  return content;
});

//Parse user data into a writtable dataEntry
ipcMain.handle('parse-file-to-json', async(event, filename, templateType) => {
  const JSON = await parseFile(filename, templateType)
  return JSON
})

//Check for duplicate filename in database
ipcMain.handle('check-duplicate-filename-in-database' , async (event, newDataEntry) => {
  const updatedDatabaseObj = await checkForDuplicate(newDataEntry)
  return updatedDatabaseObj
})

//Get user confirm (To overwrite existingfile)
ipcMain.handle('get-user-confirmation', async(event, message) => {
  const userResponse = await getUserConfirmation(message)
  return userResponse
})

//Update Database
ipcMain.handle('update-database' , async(event, updatedDatabaseObj) => {
  const result = await updateDatabase(updatedDatabaseObj);
  if (result.success) {
    return 'Data is successfully updated to database';
  } else {
    return `Data update failed, please try again : ${result.error}`
  }
})

//Append to database
ipcMain.handle('append-data-to-database', async(event, dataEntry) => {

  const result = await appendtoDatabase(dataEntry);
  if (result.success) {
    return 'Data is successfully appended to database';
  } else {
    return `Data append failed, please try again : ${result.error}`
  }
})

//Save file in directory
ipcMain.handle('save-template-in-directory', async(event, fileBufferArray, filename, templateType) => {
  const result = await saveTemplates(fileBufferArray, filename, templateType)

  if (result.success) {
    return 'Template is succesfully saved to directory';
  } else {
    return `Template failed to save to directory, please try again : ${result.error}`
  }
})


//-------------------------Create App Window and load URL-------------------------------
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //title: `${packageJson.config.forge.packagerConfig.name} ${packageJson.config.forge.packagerConfig.version}`,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
    
  });
    // and load the index.html of the app.
    const isDev = process.env.NODE_ENV === 'development';
    const startUrl = isDev
      ? 'http://localhost:3000'
      : url.format({
          pathname: path.join(__dirname, '../build/index.html'),
          protocol: 'file:',
          slashes: true
        });
    

      //logToFile(`The file path loaded is : ${startUrl}`)

      mainWindow.loadURL(startUrl)

      //Set the app title and version number
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = require(packageJsonPath);

      const appName = packageJson.productName;
      const appVersion = packageJson.version;

      
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle(`${appName} ${appVersion}`);

    });
    
};

app.whenReady().then(() => {

  createWindow()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      
    }
  })

})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



