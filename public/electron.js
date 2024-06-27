const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

const isDev = require("electron-is-dev");
const authService = require('./utils/auth/authService');
const authProcess = require('./utils/auth/authProcess')

const widthWindowMode = 820;
const heigthWindowMode = 550;

const widthMinimalistMode = 150;
const heigthMinimalistMode = 190;
const maxWidthMinimalistMode = 250;
const maxHeigthMinimalistMode = 250;

function createWindow() {
  const win = new BrowserWindow({
    width: widthWindowMode,
    height: heigthWindowMode,
    minWidth: widthWindowMode,
    minHeight: heigthWindowMode,
    alwaysOnTop: false,
    minimizable: true,
    maximizable: true,
    webPreferences: {
      devTools: isDev,
      backgroundThrottling: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/logo192.png`,
  });

  win.setMenuBarVisibility(isDev);

  win.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  return {
    win
  }
};

app.whenReady().then(() => {
  const { win } = createWindow();
  ipcMain.handle('auth:get-session-jira-data', authService.getSessionJiraData);
  ipcMain.handle("set-minimalist-timer-mode", async (event, ...args) => {
    win.setMaximumSize(maxWidthMinimalistMode, maxHeigthMinimalistMode);
    win.setMinimumSize(widthMinimalistMode, heigthMinimalistMode);
    win.setSize(widthMinimalistMode, heigthMinimalistMode);
    win.setMinimizable(false);
    win.setMaximizable(false);
    win.setPosition(50, 50, true);
    win.setAlwaysOnTop(true);
  });
  ipcMain.handle("set-initial-timer-mode", async (event, ...args) => {
    win.setMinimumSize(widthWindowMode, heigthWindowMode);
    win.setMaximumSize(4000, 4000);
    win.setSize(widthWindowMode, heigthWindowMode);
    win.setMinimizable(true);
    win.setMaximizable(true);
    win.center();
    win.setAlwaysOnTop(false);
  });
  ipcMain.handle("auth:logon", async (event, ...args) => {
    authProcess.createAuthWindow(win)
  });
  ipcMain.on("reload-page", () => {
    win.reload();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  globalShortcut.register('CommandOrControl+Shift+R', () => {})
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


module.exports = {
  createWindow
};