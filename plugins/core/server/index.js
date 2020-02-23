const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');


module.exports = function (server) {
    function loadScenarios() {
        const files = glob.sync(`scenarios/${process.env.SCENARIO}/data/*`);
        _.forEach(files, (file) => {
            let section = file.replace(`scenarios/${process.env.SCENARIO}/data/`, '');
            section = section.replace(/\..*$/, '');
            if (fs.lstatSync(file).isFile()) {
                m.scenario[section] = yaml.load(fs.readFileSync(file, 'utf8'));
            } else {
                const minifiles = glob.sync(`${file}/*`);
                m.scenario[section] = {};
                _.forEach(minifiles, (minifile) => {
                    m.scenario[section] = _.merge(m.scenario[section], yaml.load(fs.readFileSync(minifile, 'utf8')));
                });
            }
        })
        console.log(m.scenario);
        m.state = _.cloneDeep(m.scenario.initState);
        //helpers = require(`../scenarios/${process.env.SCENARIO}/helpers/server_helpers.js`)(m.scenario, state);
    }
    const m = {
        state: {},
        scenario: {},
        getKnowledge: function() {
            var newInfo = _.cloneDeep(m.scenario);
            newInfo.locations = _.pickBy(newInfo.locations, function (v,k) {
                return m.state.knownLocations[k];
            });
            newInfo.poiConnections = _.pickBy(newInfo.poiConnections, function (v,k) {
                return m.state.knownLocations[v.path[0]]&&m.state.knownLocations[v.path[1]];
            });
            return newInfo;
        },
        addEndpoints: function () {
            m.app.get('/', function (req, res) {
                res.send('Such an unreasonable request! Never contact me again. I will call the police if you do.');
            });
            m.app.get('/knowledge', function (req, res) {
                res.json(m.getKnowledge());
            });
        
            m.app.get('/state', function (req, res) {
                res.json(m.state);
            });        
        },
        updatePayload: function(payload) {
            payload.state = m.state;
        }
    };
    m.app = server.app;
    loadScenarios();
    m.state = m.scenario.initState;

    return m;
};