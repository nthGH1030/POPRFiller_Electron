
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



