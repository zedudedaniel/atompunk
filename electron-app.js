const { app, BrowserWindow } = require('electron');
const express = require('express'); //your express app
const server = require('./lib/server.js');


function createWindow() {
  server.launch(2999,8080);
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
 // win.setMenuBarVisibility(false);

  win.loadURL('http://localhost:2999/index.html');
  win.focus();
}

app.whenReady().then(createWindow);