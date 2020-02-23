const _ = require('lodash');

module.exports = function (server) {
    let scenario;
    let state;
    const m = {
        addEndpoints: function () {
            m.app.post('/event', function (req, res) {
                var locName = req.body.location;
                state.location.name = locName;
                _.forEach(scenario.poiConnections, function (v, k) {
                    if (v.path[0] === locName) {
                        state.knownLocations[v.path[1]] = true;
                    }
                    if (v.path[1] === locName) {
                        state.knownLocations[v.path[0]] = true;
                    }
                })
                res.json({
                    success: true,
                    state: state,
                    knowledge: server.plugins.core.getKnowledge()
                });
            });
        }
    };
    m.app = server.app;
    scenario = server.plugins.core.scenario;
    state = server.plugins.core.state;
    return m;
};