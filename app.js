const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const glob = require('glob');
const _ = require('lodash');
require('dotenv').config();
const scenario = {};
const app = express();
const port = 3000;
const WebSocket = require('ws');
const moment = require('moment');
const bodyParser = require('body-parser');
let state;
let timer;
const helpers = require(`./scenarios/${process.env.SCENARIO}/helpers/server_helpers.js`)(scenario);

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Such an unreasonable request! Never contact me again. I will call the police if you do.');
});

app.get('/knowledge', function (req, res) {
    res.json(helpers.getKnowledge());
});

app.post('/event', function (req, res) {
    state.location.name=req.body.location;
    res.json(helpers.getKnowledge());
});

app.get('/state', function (req, res) {
    res.json(state);
});

app.get('/scenario/:scenario/:file', function (req, res) {
    fs.readFile(`scenarios/${req.params.scenario}/${req.params.file}`, "utf8", function(err, data){
        if(err) {
            console.log(err);
        }
    
        //var resultArray = //do operation on data that generates say resultArray;
    
        res.send(data);
    });
});
try {
    loadScenarios();
  } catch (e) {
    console.log(e);
  }
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
});

const wss = new WebSocket.Server({ port: 8080 });

function sendState(ws) {
    //ws.send(Math.random()*100000000000);
    state.time = moment(state.time).add(1, 'days').toDate();
    ws.send(JSON.stringify(state));
    timer = setTimeout(sendState,1000,ws);
}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close', function close() {
    console.log('disconnected');
    clearTimeout(timer);
  });
  timer = setTimeout(sendState,1000,ws);
});

function loadScenarios() {
    glob(`scenarios/${process.env.SCENARIO}/data/*`, function (er, files) {
        console.log(files);
        _.forEach(files, (file) => {
            let section = file.replace(`scenarios/${process.env.SCENARIO}/data/`, '');
            section = section.replace(/\..*$/,'');
            if (fs.lstatSync(file).isFile()) {
                scenario[section] = yaml.load(fs.readFileSync(file, 'utf8'));
            } else {
                const minifiles = glob.sync(`${file}/*`);
                scenario[section] = {};
                _.forEach(minifiles, (minifile) => {
                    scenario[section] = _.merge(scenario[section],yaml.load(fs.readFileSync(minifile, 'utf8')));
                });
            }
        })
        console.log(scenario);
        state = scenario.initState;
        state.time = moment().add(100, 'years').toDate();
      })
}