const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url')
const fs = require('fs').promises;
const log = require('electron-log');



// Configure electron-log
log.transports.file.resolvePath = () => path.join(path.dirname(app.getPath('exe')), 'app.log');

// Logging function
function logToFile(message) {
  log.info(message);
}


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

// Function to read file content
async function readFileContent(filePath) {
    try {
        const content = await fs.readFile(filePath);
        return content;
    } catch (error) {
        console.error('Failed to read file:', error);
        throw error; 
    }
}


// Handle load-template-po
ipcMain.handle('load-template-po', async () => {
  const poPath = path.join(__dirname, './secrets/template PO.xlsx');
  //console.log(poPath);
  const PO = await readFileContent(poPath);
  return PO;
});

// Handle load-template-pr
ipcMain.handle('load-template-pr', async () => {
  const prPath = path.join(__dirname, './secrets/template PR.xlsx');
  const PR = await readFileContent(prPath);
  return PR;
});


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
    : path.join(__dirname, '../build/index.html')

    //logToFile(`The file path loaded is : ${startUrl}`)

    mainWindow.loadFile(startUrl)

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



