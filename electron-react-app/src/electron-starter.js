
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;
let isDev; 

async function checkIsDev() {
  const electronIsDev = await import('electron-is-dev');
  isDev = electronIsDev.default;
}

async function createWindow() {
  await checkIsDev();
  if (win) {
    console.log('Window already created. Skipping...');
    return; // Skip if win is already defined
  }

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    
  });
  
  // Delay loading in development mode to ensure the server is ready
  if (isDev) {
    console.log('Waiting for the development server to become ready...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
  }

  const appURL = isDev
    ? 'http://localhost:3000' // URL for dev server
    : 'file://' + path.join(__dirname, '../build/index.html'); // Adjust as necessary for production build path

  win.loadURL(appURL);
  
  win.on('closed', () => {
    win = null; // Dereference the window object
  });
}

// Ensure createWindow is called only once when the app is ready
if (!app.isReady()) {
  app.whenReady().then(createWindow);
} else {
  createWindow(); // Call createWindow immediately if app is already ready
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});



