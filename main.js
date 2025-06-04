const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

let mainWindow;

function createWindow() {
  const savedBounds = store.get('windowBounds') || { width: 200, height: 200, x: undefined, y: undefined };

  mainWindow = new BrowserWindow({
    width: savedBounds.width,
    height: savedBounds.height,
    x: savedBounds.x,
    y: savedBounds.y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true, // We'll handle custom resizing
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    skipTaskbar: true, // To make it feel more like an overlay
  });

  mainWindow.loadFile('index.html');

  // Make window draggable (basic implementation)
  // More sophisticated dragging will be in renderer.js
  mainWindow.on('moved', () => {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', bounds);
  });

  mainWindow.on('resized', () => {
    const bounds = mainWindow.getBounds();
    store.set('windowBounds', bounds);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open DevTools - remove for production
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'] }],
  });
  if (!result.canceled && result.filePaths.length > 0) {
    store.set('watermarkImagePath', result.filePaths[0]);
    return result.filePaths[0];
  }
  return store.get('watermarkImagePath'); // Return last saved if canceled or no selection
});

ipcMain.handle('get-last-image', () => {
  return store.get('watermarkImagePath');
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('set-opacity', (event, opacity) => {
  if (mainWindow) {
    mainWindow.setOpacity(parseFloat(opacity));
    store.set('watermarkOpacity', parseFloat(opacity));
  }
});

ipcMain.handle('get-last-opacity', () => {
  return store.get('watermarkOpacity', 1); // Default to 1 (fully opaque)
});

// Allow the window to be shown/hidden if needed later
// ipcMain.on('show-window', () => mainWindow && mainWindow.show());
// ipcMain.on('hide-window', () => mainWindow && mainWindow.hide());

// Ensure the app quits when explicitly told to, even on macOS
app.on('before-quit', () => {
  // You might want to save any final state here
});