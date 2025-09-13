const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getApiKey: (provider) => ipcRenderer.invoke('get-api-key', provider),
  setApiKey: (provider, apiKey) => ipcRenderer.invoke('set-api-key', provider, apiKey),
  deleteApiKey: (provider) => ipcRenderer.invoke('delete-api-key', provider),
  getCurrentProvider: () => ipcRenderer.invoke('get-current-provider'),
  setCurrentProvider: (provider) => ipcRenderer.invoke('set-current-provider', provider),
  selectFile: () => ipcRenderer.invoke('select-file'),
  readFileContent: (filePath) => ipcRenderer.invoke('read-file-content', filePath),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});
