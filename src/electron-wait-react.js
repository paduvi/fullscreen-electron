/**
 * Created by chotoxautinh on 6/1/17.
 */
const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;
var Sudoer = require('electron-sudo').default;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;

            let options = {name: 'death fullscreen application'}
            var sudoer = new Sudoer(options);
            sudoer.spawn('echo', ['$PARAM'], {env: {PARAM: 'VALUE'}}).then(function (cp) {
                const exec = require('child_process').exec;
                exec('npm run electron');
                /*
                 cp.output.stdout (Buffer)
                 cp.output.stderr (Buffer)
                 */
            });
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});