const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url')
const fs = require('fs').promises;
const log = require('electron-log');
const { toArrayBuffer } = require('./utils/Parser_toArrayBuffer');
const {ensureDatabaseExist, parseFile, appendtoDatabase, 
      updateDatabase, checkForDuplicate ,getUserConfirmation, ensureTemplateDirectoryExist,
      saveTemplates, getFileDatabyTemplateType, selectAndDeselectTemplate, deselectAllTemplate,
      findTemplate, findSelectedTemplate} 
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

function handleSquirrelEvent() {
  /*
  if (process.platform !== 'win32') {
    return false;
  }
    */

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
      //falls through
      
    case '--squirrel-updated':
      //logToFile(`--squirrel-updated: ${process.argv}`)
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);
      (async () => {
        logToFile('Starting deselectAllTemplates');
        const startTime = Date.now();
        const POResult = await deselectAllTemplate('PO')
        const PRResult = await deselectAllTemplate('PR')
        const endTime = Date.now();
        logToFile(`deselectAllTemplates took ${endTime - startTime} ms`);

        if(POResult != {success: true} || PRResult != {success: true} ) {
          logToFile(`Failed to deselect templates: ${POResult.error} ,${PRResult.error}`);
        }
      })();

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

    default:
      app.quit();
      return true;
  }
};
//------------------------------------------------------------------------------
function main() {
  
  const isDev = process.env.NODE_ENV === 'development';
  if (!isDev) {
    if (handleSquirrelEvent()) {
      // squirrel event handled and app will exit in 1000ms, so don't do anything else
      return
    }
  }
    // Create the browser window and load URL
    const createWindow = () => {
      const mainWindow = new BrowserWindow({
        width: 1000,
        height: 900,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),
          contextIsolation: true,
        }
      });

      const startUrl = isDev
        ? 'http://localhost:3000'
        : url.format({
            pathname: path.join(__dirname, '../build/index.html'),
            protocol: 'file:',
            slashes: true
          });
  
      mainWindow.loadURL(startUrl);
  
      const packageJsonPath = path.join(__dirname, '../package.json');
      const packageJson = require(packageJsonPath);
  
      const appName = packageJson.productName;
      const appVersion = packageJson.version;
  
      mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setTitle(`${appName} ${appVersion}`);
      });
    };
  
    app.whenReady().then(() => {
      createWindow();
  
      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    });
  
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    //---------------Debug tool-------------------------------------------------//
  ipcMain.handle('log-main-process-message' , async (event) => {
    const databaseExist = await ensureDatabaseExist()
    const POdirectoryExist = await ensureTemplateDirectoryExist('PO')
    const PRdirectoryExist = await ensureTemplateDirectoryExist('PR')
    const userDataPath = app.getPath('userData')
    return [`Message: ${userDataPath}, ${databaseExist}, ${POdirectoryExist}, ${PRdirectoryExist}`]
  })

  //functions to be exposed in renderer process---------------------------------//
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
    const templatePaths = {
      'PO': './secrets/template PO.xlsx',
      'PR': './secrets/template PR.xlsx',
    }
    
    const demoPaths = {
      'PO': './demoTemplate/template PO_demo.xlsx',
      'PR': './demoTemplate/template PR_demo.xlsx',
    }
    try {
      const selectedTemplateObj = await findSelectedTemplate(templateType)
      
      if (selectedTemplateObj) {
        const userDataPath = app.getPath('userData')
        const templateDirectory = path.join(userDataPath, 'UserUploadedTemplate', templateType)
        const selectedFilepath = path.join(templateDirectory, selectedTemplateObj.filename)
        const selectedTemplate = await readFileToBufferArray(selectedFilepath);
        return selectedTemplate
    
      } else {

        if(templatePaths) {
          const defaultPath = path.join(__dirname, templatePaths[templateType]);
          const defaultTemplate = await readFileToBufferArray(defaultPath);
          return defaultTemplate

        } else {
          const defaultPath = path.join(__dirname, demoPaths[templateType]);
          const defaultTemplate = await readFileToBufferArray(defaultPath);
          return defaultTemplate
        }
      }
    } catch (error) {

        log.info(error);
    }
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

  //get file data by template type from database
  ipcMain.handle('get-file-data-by-template-type', async (event, templateType) => {
    const result = await getFileDatabyTemplateType(templateType)

    return result
  })

  //select and de-select template by updating database
  ipcMain.handle('select-deselect-template', async(event, filename, templateType) => {
    const result  = await selectAndDeselectTemplate(filename , templateType)

    if (result.success) {
      return 'Database has been updated to select and de-selecte template'
    } else {
      return 'Database failed to update select and de-select of templates'
    }
  })

  //find selected template
  ipcMain.handle('find-selected-template', async(event, filename) => {
    const result = await findTemplate(filename)
    if (result) {
      return result
    } else {
      return 'Fail to find selected template'
    }
  })
}

main()