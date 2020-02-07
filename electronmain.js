const { app, BrowserWindow } = require('electron')
const express = require('express'); //your express app

function createWindow() {
  // Create the browser window.
  const app = express();
  app.use(express.static(__dirname + '/public'));
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenuBarVisibility(false);
  app.listen(5000, function () {
    console.log(`Example app listening on port ${port}!`)
  });


  // and load the index.html of the app.
  win.loadURL('http://localhost:5000/index.html');
  win.focus();
}

app.whenReady().then(createWindow);
