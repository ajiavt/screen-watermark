const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectImage: () => ipcRenderer.invoke('select-image'),
  getLastImage: () => ipcRenderer.invoke('get-last-image'),
  closeApp: () => ipcRenderer.send('close-app'),
  setOpacity: (opacity) => ipcRenderer.send('set-opacity', opacity),
  getLastOpacity: () => ipcRenderer.invoke('get-last-opacity'),
  // Expose a function to notify the main process about mouse events for dragging
  // This is a more robust way to handle dragging for frameless windows
  startDrag: () => ipcRenderer.send('start-drag'), // We might not need this if handled in renderer
  onStoreUpdate: (callback) => ipcRenderer.on('store-updated', (_event, value) => callback(value))
});

// It's good practice to also listen for specific messages if the main process needs to push updates
// For example, if another part of the app changes the image or opacity:
ipcRenderer.on('update-image', (event, imagePath) => {
  // You could have a global function or event emitter in your renderer to handle this
  window.dispatchEvent(new CustomEvent('electron-update-image', { detail: imagePath }));
});

ipcRenderer.on('update-opacity', (event, opacity) => {
  window.dispatchEvent(new CustomEvent('electron-update-opacity', { detail: opacity }));
});