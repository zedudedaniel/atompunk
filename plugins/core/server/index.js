const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');
const express = require('express');

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
        },
        updatePage: function(page) {
            const body = page.window.document.getElementsByTagName("body")[0];
            body.className = 'main';
            const head = page.window.document.getElementsByTagName("head")[0];
            head.innerHTML='<title>'+m.scenario.config.title+'</title>'+ 
            '<link rel="stylesheet" type="text/css" href="/css/style.css"/>' + 
            '<link rel="stylesheet" href="/css/jquery-ui.min.css"/>' + 
            '<link rel="stylesheet" href="/css/jquery-ui.structure.min.css"/>' + 
            '<script>if (typeof module === "object") {window.module = module; module = undefined;}</script>' + 
            '<script src="/js/lib/jquery.min.js"></script>' + 
            '<script src="/js/lib/lodash.min.js"></script>' + 
            '<script src="/js/lib/jquery-ui.min.js"></script>' + 
            '<script src="/js/lib/moment-with-locales.min.js"></script>' + 
            '<script src="/js/core.js"></script>' +
            '<script src="/js/main.js"></script>' +
            '<script>if (window.module) module = window.module;</script>';
            body.insertAdjacentHTML('afterbegin','<img id="resource-info-button" src="/images/resource_info_icon.png"/><div id="resource-info"></div>');
        }
    };
    m.app = server.app;
    loadScenarios();
    m.app.use(express.static(`scenarios/${process.env.SCENARIO}/public`));
    m.state = m.scenario.initState;

    return m;
};