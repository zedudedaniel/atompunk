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
const { JSDOM } = require('jsdom');
const pretty = require('pretty');

let timer;
let webSocket;
const page = {
    plugins: [],
    dom: new JSDOM(''),
    addScript: function(scriptName) {
        this.dom.window.document.getElementsByTagName("head")[0].insertAdjacentHTML('afterbegin','<script src="'+scriptName+'"></script>');
    },
    addCSS: function(cssName) {
        this.dom.window.document.getElementsByTagName("head")[0].insertAdjacentHTML('afterbegin','<link rel="stylesheet" type="text/css" href="'+cssName+'">');
    },
    addPlugin: function(pluginName) {
        this.plugins.push(pluginName);
    },
    addHeadElement: function(headElement) {
        this.dom.window.document.getElementsByTagName("head")[0].insertAdjacentHTML('afterbegin', headElement);
    },
    addBodyElement: function(bodyElement) {
        this.dom.window.document.getElementsByTagName("body")[0].insertAdjacentHTML('afterbegin', bodyElement);
    },
    getHTML: function() {
        this.addScript('/js/main.js');
        this.addBodyElement('<script>' +
            '$(document).ready(function () {' +
            "main.plugins=['" + this.plugins.join("','") + "'];" +
            '_.forEach(main.plugins, function(v,k) {if(globalThis[v].init) {globalThis[v].init()}});' +
            'main.init();' +
            '});</script>'
        );
        return pretty( this.dom.serialize() );
    }
}

const m = {
    plugins: {}
};

function setupExpress() {
    app.use(express.static('public'));
    app.use(bodyParser.json());
    m.app = app;
}

function setupEndpoints() {
    app.get('/', function (req, res) {
        res.send(page.getHTML());
    });
    _.forEach(m.plugins, function (v,k) {
        if (v.addEndpoints) {
            v.addEndpoints(app);
        }
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
    let config = yaml.load(fs.readFileSync(`./scenarios/${process.env.SCENARIO}/data/config.yml`, 'utf8'));
    let plugins = config.plugins;
    _.forEach(plugins, function(v,k) {
        file = `./plugins/${v}/server/index.js`;
        if (fs.existsSync(file)) {
            m.plugins[v] = require('../'+file)(m);
        }
    });
    _.forEach(m.plugins, function (v,k) {
        if (v.updatePage) {
            page.addPlugin(k);
            v.updatePage(page);
        }
    });
}

function publishPublic() {
    _.forEach(m.plugins, function(v,k){
        //TODO: Check if public actually exists
        app.use(`/plugins/${k}`,express.static(`plugins/${k}/public`));
    })
}

m.launch = function (port = 3000, wsPort = 8080) {
    setupExpress();
    setupWebsockets(wsPort);
    loadPlugins();
    publishPublic();
    setupEndpoints();

    app.listen(port, function () {
        console.log(`Example app listening on port ${port}!`)
    });
};

module.exports = m;