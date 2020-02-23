const _ = require('lodash');
const moment = require('moment');


module.exports = function (server) {
    let state;

    const m = {
        addEndpoints: function () {
            m.app.post('/time-control', function (req, res) {
                state.timeRunning = !state.timeRunning;
                res.json({
                    success: true,
                    state: state
                });
            });
        },
        updatePayload: function(payload) {
            if (state.timeRunning) {
                payload.state.time = moment(payload.state.time).add(1, 'days').toDate();
            }
        }
    };
    m.app = server.app;
    state = server.plugins.core.state;
    state.time = moment().add(100, 'years').toDate();
    return m;
};