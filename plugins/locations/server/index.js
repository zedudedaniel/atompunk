const _ = require('lodash');

module.exports = function (server) {
    const m = {
        updatePage: function(page) {
            page.addBodyElement('<div id="poi-info"></div>');
            page.addScript('/plugins/locations/js/locations.js');
            page.addCSS('/plugins/locations/css/locations.css');
        },
        addEndpoints: function () {
            m.app.post('/location', function (req, res) {
                var locName = req.body.location;
                m.state.location.name = locName;
                /*
                _.forEach(scenario.poiConnections, function (v, k) {
                    if (v.path[0] === locName) {
                        state.knownLocations[v.path[1]] = true;
                    }
                    if (v.path[1] === locName) {
                        state.knownLocations[v.path[0]] = true;
                    }
                })
                */
                res.json({
                    success: true,
                    //state: m.state,
                    //knowledge: m.app.plugins.core.getKnowledge()
                });
            });
        },
        updatePayload: function() {
            _.forEach(m.scenario.poiConnections, function (v, k) {
                if (v.path[0] === m.state.location.name) {
                    m.state.knownLocations[v.path[1]] = true;
                }
                if (v.path[1] === m.state.location.name) {
                    m.state.knownLocations[v.path[0]] = true;
                }
            });
            m.state.startEvent
        }
    };
    m.app = server.app;
    m.scenario = server.plugins.core.scenario;
    m.state = server.plugins.core.state;
    return m;
};
