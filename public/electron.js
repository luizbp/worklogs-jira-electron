const { app, BrowserWindow } = require("electron");
const path = require("path");

const isDev = require("electron-is-dev");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 550,
    minWidth: 300,
    minHeight: 550,
    maxWidth: 550,
    maxHeight: 600,
    alwaysOnTop: true,
    minimizable: true,
    maximizable: false
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
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
