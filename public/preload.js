const {ipcRenderer, contextBridge} = require('electron');
contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer)

// API Definition
const electronAPI = {
  getSessionJiraData: () => ipcRenderer.invoke('auth:get-session-jira-data'),
  logOut: () => ipcRenderer.send('auth:log-out'),
};

// Register the API with the contextBridge
process.once("loaded", () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});