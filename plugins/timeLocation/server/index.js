const _ = require('lodash');

module.exports = function (server) {
    const m = {
        oldLocation: server.plugins.core.scenario.initState.location.name,
        updateState: function(state) {
            if (m.oldLocation!==_.get(state,'location.name')) {
                m.destination=state.location.name;
                state.location.name=m.oldLocation;
                setTimeout(function(){
                    state.location.name=m.destination;
                    m.oldLocation=m.destination;
                }, 3000);
            }
        }
    };
    m.app = server.app;
    m.server = server;
    return m;
};
