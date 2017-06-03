## Death FullScreen

### Description: 
Demo Fullscreen app with Electron

### Requirement:
- Nodejs >= 6.0: https://nodejs.org/en/

### Deployment:
1. Download zip project or clone by command:

`git clone https://github.com/paduvi/fullscreen-electron.git`

2. Go to project directory and install required Javascript library:

`cd fullscreen-electron && npm install`

3. Package application:
- Window: `npm run build && npm run package-win`
- MacOSX: `npm run build && npm run package-mac`
- Linux: `npm run build && npm run package-linux`

After building process, packaged app will be appeared in `dist` folder.

### Custom:
- Logo icons are located in `public/icon` folder, just replace files with the same name then run package command.
- **App Name**, **App Version** can be renamed in `package.json` by modifying `productName`, `version` value, respectively.
