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

  if (isDev) {
    // Development URL
    mainWindow.loadURL('http://localhost:3000').catch(err => console.error('Error loading the URL:', err));
    mainWindow.webContents.openDevTools()
  } else {
    // Production path
    mainWindow.loadFile(path.join(__dirname, '../build/index.html')).catch(err => console.error('Error loading the file:', err));
  }

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

