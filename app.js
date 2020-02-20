const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const glob = require('glob');
const _ = require('lodash');
require('dotenv').config();
const scenario = {};
const app = express();
const port = 3000;
let state;
const helpers = require(`./scenarios/${process.env.SCENARIO}/helpers/server_helpers.js`)(scenario);

app.get('/', function (req, res) {
    res.send('Such an unreasonable request! Never contact me again. I will call the police if you do.');
});

app.get('/knowledge', function (req, res) {
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
app.use(express.static('public'));
try {
    loadScenarios();
  } catch (e) {
    console.log(e);
  }
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
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
      })
}