const { app, BrowserWindow } = require('electron');
const http = require('http');
const parh = require('path');

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

  /*
  checkServerReady()
    .then(() => {
      mainWindow.loadURL('http://localhost:3000');
    })
    .catch(err => console.error('Server never became ready', err));
    */

  mainWindow.webContents.openDevTools()
}

function checkServerReady(attempt = 1) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000', (res) => {
      if (res.statusCode === 200) {
        console.log('Server is ready');
        resolve();
      } else {
        console.log('Server responded, but not with a 200 status. Retrying...');
        setTimeout(() => resolve(checkServerReady(attempt + 1)), 2000);
      }
    }).on('error', (err) => {
      if (attempt > 5) { // Give up after 5 attempts
        reject(new Error('Server not ready after 5 attempts'));
      } else {
        console.log(`Attempt ${attempt}: Server not ready, retrying...`);
        setTimeout(() => resolve(checkServerReady(attempt + 1)), 2000);
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


/*
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;
let isDev; 

async function checkIsDev() {
  const electronIsDev = await import('electron-is-dev');
  isDev = electronIsDev.default;
}

const http = require('http');

// Function to check if the development server is ready
function checkServerReady() {
  return new Promise((resolve, reject) => {
    const options = {
      host: 'localhost',
      port: 3000,
      timeout: 2000, // 2 seconds timeout for each request
    };

    const request = http.get(options, (res) => {
      if (res.statusCode === 200) {
        console.log('Development server is ready.');
        resolve(true);
      } else {
        console.log('Server responded, but not with a 200 status. Retrying...');
        setTimeout(() => resolve(checkServerReady()), 2000); // Retry after 2 seconds
      }
    });

    request.on('error', (err) => {
      console.log('No response from server, retrying...');
      setTimeout(() => resolve(checkServerReady()), 2000); // Retry after 2 seconds
    });

    request.end();
  });
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

if (isDev) {
  console.log('Checking if the development server is ready...');
  checkServerReady().then(() => {
    // Server is ready, load the URL
    win.loadURL('http://localhost:3000');
  });
} else {
  // Load production URL
  win.loadURL('file://' + path.join(__dirname, '../build/index.html'));
}
  
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



*/