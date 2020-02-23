const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const glob = require('glob');
const _ = require('lodash');
require('dotenv').config();
const scenario = {};
const app = express();
const WebSocket = require('ws');
const bodyParser = require('body-parser');

let timer;
let webSocket;

const m = {
    plugins: {}
};

function setupExpress() {
    app.use(express.static('public'));
    app.use(bodyParser.json());
    m.app = app;
}

function setupEndpoints() {
    _.forEach(m.plugins, function (v,k) {
        v.addEndpoints(app);
    });
}

function setupWebsockets(wsPort) {
    const wss = new WebSocket.Server({ port: wsPort });
    wss.on('connection', function connection(ws) {
        webSocket = ws;
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
        ws.on('close', function close() {
            console.log('disconnected');
            clearTimeout(timer);
        });
        timer = setTimeout(sendPayload, 1000, ws);
    });
}

function sendPayload(ws) {
    const payload = {};    
    _.forEach(m.plugins, function (v,k) {
        if (v.updatePayload) {
            v.updatePayload(payload);
        }
    });
    ws.send(JSON.stringify(payload));
    timer = setTimeout(sendPayload, 1000, ws);
}

function loadPlugins() {
    let plugins = yaml.load(fs.readFileSync(`./scenarios/${process.env.SCENARIO}/data/plugins.yml`, 'utf8'));
    _.forEach(plugins, function(v,k) {
        file = `./plugins/${v}/server/index.js`;
        if (fs.existsSync(file)) {
            m.plugins[v] = require('../'+file)(m);
        }
    });
}

m.launch = function (port = 3000, wsPort = 8080) {
    setupExpress();
    setupWebsockets(wsPort);
    loadPlugins();
    setupEndpoints();

    app.listen(port, function () {
        console.log(`Example app listening on port ${port}!`)
    });
};

module.exports = m;