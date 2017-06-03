/**
 * Created by chotoxautinh on 6/1/17.
 */
process.env.PIN = process.env.PIN || 123456;
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const {BrowserWindow} = electron
const {ipcMain} = require('electron')
const path = require('path')
const url = require('url')
const Sudoer = require('electron-sudo').default;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow, loadingScreen;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 500, height: 540,
        show: false,
        frame: false,
        icon: path.join(__dirname, '/../public/png/logo.png')
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.setFullScreen(true);
        mainWindow.show();

        if (loadingScreen) {
            let loadingScreenBounds = loadingScreen.getBounds();
            mainWindow.setBounds(loadingScreenBounds);
            loadingScreen.close();
        }
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow({
        width: 500,
        height: 500,
        resizable: false,
        show: false,
        frame: false,
        icon: path.join(__dirname, '/../public/png/logo.png'),
        parent: mainWindow
    });
    const url = process.env.ELECTRON_START_URL ? path.join(__dirname, '/../public/loading.html') : path.join(__dirname, '/../build/loading.html')
    loadingScreen.loadURL('file://' + url);
    loadingScreen.on('closed', () => loadingScreen = null);
    loadingScreen.webContents.on('did-finish-load', () => {
        loadingScreen.show();
    });
}

ipcMain.on('pin-code', (event, pinCode, left) => {
    console.log(pinCode);
    if (pinCode != process.env.PIN) {
        if (left == 1) {
            const exec = require('child_process').exec;
            exec('sudo shutdown -r now');
        } else {
            event.sender.send('wrong-pin');
            return;
        }
    }
    mainWindow.close();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // const options = {name: 'fullscreen demo application'}
    // const sudoer = new Sudoer(options);
    // sudoer.spawn('echo', ['$PARAM'], {env: {PARAM: 'VALUE'}}).then(function (cp) {
    //
    //     cp.on('close', () => {
    //         console.log('stdout: ' + cp.output.stdout.toString());
    //         console.log('stderr: ' + cp.output.stderr.toString());
    //
    //         if (cp.output.stdout.toString()) {
                createLoadingScreen();
                createWindow();
    //         }
    //     });
    // });

})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('before-quit', (e) => {
    if (mainWindow && !loadingScreen) {
        mainWindow.webContents.send('interrupt');
        e.preventDefault();
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.