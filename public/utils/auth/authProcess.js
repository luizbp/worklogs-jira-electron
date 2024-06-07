const { BrowserWindow } = require('electron');
const authService = require('./authService');

let win = null;

async function createAuthWindow(winMain) {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
    },
    maximizable: false,
    minimizable: false,
  });

  const urlLoad = authService.getAuthenticationURL()

  win.loadURL(urlLoad);

  const {session: {webRequest}} = win.webContents;

  const filter = {
    urls: [
      'http://localhost/callback*'
    ]
  };

  webRequest.onBeforeRequest(filter, async ({url}) => {
    try {
        await authService.loadTokens(url);
        await winMain.webContents.executeJavaScript(`window.localStorage.setItem("worlogs-jira-session-data", '${JSON.stringify(authService.getSessionJiraData())}');`);
        winMain.reload();
        return destroyAuthWin();
    } catch (error) {
        console.log("TCL: createAuthWindow -> error", error)
    }
  });

  win.on('authenticated', () => {
    destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createLogoutWindow() {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on('ready-to-show', async () => {
    await authService.logout();
    logoutWindow.close();
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};