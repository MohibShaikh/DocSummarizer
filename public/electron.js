const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const keytar = require('keytar');
const pdfParse = require('pdf-parse');

const store = new Store();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

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

// IPC handlers for secure communication
ipcMain.handle('get-api-key', async (event, provider) => {
  try {
    const key = await keytar.getPassword('anthropic-desktop-client', `api-key-${provider}`);
    return key;
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
});

ipcMain.handle('set-api-key', async (event, provider, apiKey) => {
  try {
    await keytar.setPassword('anthropic-desktop-client', `api-key-${provider}`, apiKey);
    return true;
  } catch (error) {
    console.error('Error setting API key:', error);
    return false;
  }
});

ipcMain.handle('delete-api-key', async (event, provider) => {
  try {
    await keytar.deletePassword('anthropic-desktop-client', `api-key-${provider}`);
    return true;
  } catch (error) {
    console.error('Error deleting API key:', error);
    return false;
  }
});

ipcMain.handle('get-current-provider', async () => {
  try {
    return store.get('current-provider', 'anthropic');
  } catch (error) {
    console.error('Error getting current provider:', error);
    return 'anthropic';
  }
});

ipcMain.handle('set-current-provider', async (event, provider) => {
  try {
    store.set('current-provider', provider);
    return true;
  } catch (error) {
    console.error('Error setting current provider:', error);
    return false;
  }
});

ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: [
        { name: 'Documents', extensions: ['pdf', 'txt', 'doc', 'docx', 'md'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0];
    }
    return null;
  } catch (error) {
    console.error('Error selecting file:', error);
    return null;
  }
});

// Handle file content reading
ipcMain.handle('read-file-content', async (event, filePath) => {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    if (fileExtension === '.pdf') {
      // Read PDF content
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return {
        content: pdfData.text,
        pages: pdfData.numpages,
        info: pdfData.info
      };
    } else if (['.txt', '.md'].includes(fileExtension)) {
      // Read text files
      const content = fs.readFileSync(filePath, 'utf8');
      return {
        content: content,
        pages: Math.ceil(content.length / 2000), // Rough estimate
        info: { title: path.basename(filePath) }
      };
    } else if (['.doc', '.docx'].includes(fileExtension)) {
      // For Word documents, we'll need additional libraries
      // For now, return a placeholder
      return {
        content: `[Word document: ${path.basename(filePath)} - Content extraction not yet implemented for .doc/.docx files]`,
        pages: 1,
        info: { title: path.basename(filePath) }
      };
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error reading file content:', error);
    throw error;
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
