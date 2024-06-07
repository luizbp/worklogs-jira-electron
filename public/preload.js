const {ipcRenderer, contextBridge} = require('electron');
contextBridge.exposeInMainWorld("ipcRenderer",ipcRenderer)

// API Definition
const electronAPI = {
  getSessionJiraData: () => ipcRenderer.invoke('auth:get-session-jira-data'),
};

// Register the API with the contextBridge
process.once("loaded", () => {
  contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});