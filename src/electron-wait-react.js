/**
 * Created by chotoxautinh on 6/1/17.
 */
const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

let startedElectron = false;
const tryConnection = () => client.connect({port: port}, () => {
        client.end();
        if(!startedElectron) {
            console.log('starting electron');
            startedElectron = true;

            const spawn = require('child_process').spawn;
            const temp = spawn('npm', ['run', 'electron']);
            temp.stdout.on('data', function(data) {
                console.log(data.toString());
                //Here is where the output goes
            });
            temp.stderr.on('data', function(data) {
                console.error(data.toString());
                //Here is where the error output goes
            });
            temp.on('close', function(code) {
                console.log('closing code: ' + code);
                //Here you can get the exit code of the script
            });
        }
    }
);

tryConnection();

client.on('error', (error) => {
    setTimeout(tryConnection, 1000);
});