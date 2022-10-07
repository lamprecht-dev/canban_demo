const path = require('path');

const { app, BrowserWindow, session } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      // preload: path.join(__dirname, 'preload.js')
    },
  });

  // and load the index.html of the app.
  win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    const reactDevToolsPath = 'C:/Users/david/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.25.0_0';
    win.webContents.openDevTools({ mode: 'detach' });
    app.whenReady().then(async () => {
      await session.defaultSession.loadExtension(reactDevToolsPath)
    })
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
