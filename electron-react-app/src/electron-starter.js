const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
  const isDev = await import('electron-is-dev').then(module => module.default);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const appURL = isDev
    ? 'http://localhost:3000' // Development URL
    : `file://${path.join(__dirname, '../build/index.html')}`; // Production path
  mainWindow.loadURL(appURL).catch(err => console.error('Error loading the URL:', err));

  if (isDev){
    mainWindow.webContents.openDevTools()
  }
  
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

