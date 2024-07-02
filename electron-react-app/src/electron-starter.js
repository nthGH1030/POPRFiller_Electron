const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    }
  });

  // and load the index.html of the app.
  const startUrl = process.env.WEB_URL || url({
    pathname: path.join(__dirname, "../build/index.html"),
    protocol: 'file',
    slashes: true
  })
  console.log(startUrl);
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