const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url')
const fs = require('fs').promises;


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

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      
    }
  });

  // and load the index.html of the app.
  const startUrl = process.env.WEB_URL || 
  url.format({
    pathname: path.join(__dirname, "../build/index.html"),
    protocol: 'file',
    slashes: true
  })
  console.log(startUrl)

  mainWindow.loadURL(startUrl);

  // Open the DevTools. 
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  // Handle load-template-poii
  ipcMain.handle('load-template-po', async () => {
    const poPath = path.join(__dirname, './secrets/template PO.xlsx');
    console.log(poPath);
    const PO = await readFileContent(poPath);
    return PO;
  });

  // Handle load-template-pr
  ipcMain.handle('load-template-pr', async () => {
    const prPath = path.join(__dirname, './secrets/template PR.xlsx');
    const PR = await readFileContent(prPath);
    return PR;
  });
  createWindow()

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



