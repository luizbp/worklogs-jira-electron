const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = require("electron-is-dev");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 550,
    height: 550,
    minWidth: 550,
    minHeight: 550,
    alwaysOnTop: false,
    minimizable: true,
    maximizable: true,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: `${__dirname}/logo192.png`,
  });

  win.setMenuBarVisibility(false);

  win.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  ipcMain.handle("set-minimalist-timer-mode", async (event, ...args) => {
    win.setMaximumSize(250, 250)
    win.setMinimumSize(195, 205)
    win.setSize(195, 205)
    win.setMinimizable(false)
    win.setMaximizable(false)
    win.setPosition(50, 50, true)
    win.setAlwaysOnTop(true)
  });

  ipcMain.handle("set-initial-timer-mode", async (event, ...args) => {
    win.setMinimumSize(550, 550)
    win.setMaximumSize(4000, 4000)
    win.setSize(550, 550)
    win.setMinimizable(true)
    win.setMaximizable(true)
    win.center();
    win.setAlwaysOnTop(false)
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
