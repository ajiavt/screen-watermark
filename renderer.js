const appContainer = document.getElementById('app-container');
const watermarkImage = document.getElementById('watermark-image');
const selectImageBtn = document.getElementById('select-image-btn');
const opacitySlider = document.getElementById('opacity-slider');
const closeBtn = document.getElementById('close-btn');
const resizeHandle = document.getElementById('resize-handle');

let isResizing = false;
let initialMouseX, initialMouseY;
let initialWidth, initialHeight;

// Load last used image and opacity on startup
async function loadInitialSettings() {
  const lastImage = await window.electronAPI.getLastImage();
  if (lastImage) {
    watermarkImage.src = lastImage;
    appContainer.classList.remove('no-image');
  } else {
    appContainer.classList.add('no-image');
  }

  const lastOpacity = await window.electronAPI.getLastOpacity();
  watermarkImage.style.opacity = lastOpacity;
  opacitySlider.value = lastOpacity;
  // Notify main process of initial opacity for window transparency
  window.electronAPI.setOpacity(lastOpacity);
}

selectImageBtn.addEventListener('click', async () => {
  const imagePath = await window.electronAPI.selectImage();
  if (imagePath) {
    watermarkImage.src = imagePath;
    appContainer.classList.remove('no-image');
  } else if (!watermarkImage.src) {
    appContainer.classList.add('no-image');
  }
});

opacitySlider.addEventListener('input', (event) => {
  const newOpacity = event.target.value;
  watermarkImage.style.opacity = newOpacity;
  window.electronAPI.setOpacity(newOpacity); // Update window opacity in main process
});

closeBtn.addEventListener('click', () => {
  window.electronAPI.closeApp();
});

// --- Resizing Logic --- //
resizeHandle.addEventListener('mousedown', (e) => {
  e.preventDefault(); // Prevent default drag behavior
  e.stopPropagation(); // Stop event from bubbling to app-container for dragging window
  isResizing = true;
  initialMouseX = e.screenX; // Use screenX/Y for consistent coordinates across displays
  initialMouseY = e.screenY;
  // We need to get the window's current size from the main process
  // or assume it's the appContainer's size if window.resizeTo is available and reliable.
  // For Electron, it's better to manage window size via main process.
  // However, for a simple visual feedback, we can use offsetWidth/Height.
  // The actual window resize will be handled by main.js listening to 'resized' event.
  initialWidth = appContainer.offsetWidth;
  initialHeight = appContainer.offsetHeight;
  document.body.style.cursor = 'nwse-resize'; // Change cursor globally
});

// --- Dragging and Resizing Window --- //
// The -webkit-app-region: drag; in CSS handles basic window dragging.
// For resizing, we need a bit more JavaScript.

// Note: Electron's default window dragging via -webkit-app-region: drag
// can sometimes conflict with custom drag/resize handles if not managed carefully.
// The `e.stopPropagation()` in mousedown handlers for controls/resize handle is important.

// More robust resizing would involve IPC to tell the main process to set window size.
// For now, the `resizable: true` on BrowserWindow and main process `resized` event
// will save the bounds. This renderer logic primarily provides the visual cue and initiates.

window.addEventListener('mousemove', (e) => {
  if (!isResizing) return;
  e.preventDefault();

  const deltaX = e.screenX - initialMouseX;
  const deltaY = e.screenY - initialMouseY;

  let newWidth = initialWidth + deltaX;
  let newHeight = initialHeight + deltaY;

  // Add minimum size constraints if desired
  newWidth = Math.max(newWidth, 100); // Min width 100px
  newHeight = Math.max(newHeight, 50);  // Min height 50px

  // In a more complete Electron app, you'd send these to the main process:
  // window.electronAPI.resizeWindow(newWidth, newHeight);
  // For now, we rely on the BrowserWindow's resizable property and the main process
  // saving the bounds on its 'resized' event.
  // This visual change is local until the main process confirms the resize.
  // To make it smoother, Electron's setSize method should be called from main.
  // For simplicity here, we assume the OS window manager handles the actual resize
  // and Electron picks it up.

  // To directly control window size from renderer (requires main process cooperation):
  // This is a simplified approach. A robust solution would use ipcRenderer.send
  // to ask the main process to resize the window.
  // window.resizeTo(newWidth, newHeight); // This might not work reliably for frameless/transparent windows

  // The main process's 'resized' event listener in main.js will handle saving the new bounds.
});

window.addEventListener('mouseup', () => {
  if (isResizing) {
    isResizing = false;
    document.body.style.cursor = 'default'; // Reset cursor
    // The 'resized' event on the BrowserWindow in main.js will save the final size.
  }
});

// Handle updates pushed from main process (if any)
window.addEventListener('electron-update-image', (event) => {
  if (event.detail) {
    watermarkImage.src = event.detail;
    appContainer.classList.remove('no-image');
  } else {
    watermarkImage.src = '';
    appContainer.classList.add('no-image');
  }
});

window.addEventListener('electron-update-opacity', (event) => {
  const newOpacity = event.detail;
  watermarkImage.style.opacity = newOpacity;
  opacitySlider.value = newOpacity;
  // No need to call setOpacity here as this event originates from a setOpacity call
});

// Initial load
loadInitialSettings();