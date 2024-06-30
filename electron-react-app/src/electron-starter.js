const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url')
const { ipcMain } = require('electron');
const fs = require('fs').promises; // Use the promise-based version of fs

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    }
  });

  // and load the index.html of the app.
  const startUrl = process.env.WEB_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file',
    slashes: true
  })
  mainWindow.loadURL(startUrl);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});



ipcMain.handle('read-file', async (event, filePath) => {
  const appPath = app.isPackaged ? app.getPath('userData') : path.join(__dirname, '../build/static'); // Adjust based on your file's location
  const fullPath = path.join(appPath, filePath);

  try {
    const data = fs.readFileSync(fullPath); // Consider async version for large files
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
});