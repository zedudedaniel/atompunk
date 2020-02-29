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
        },
        updatePage: function(page) {
            page.addBodyElement('<div id="time-button"></div><div id="ingame-clock"></div>');
            page.addScript('/plugins/time/js/time.js');
            page.addCSS('/plugins/time/css/time.css');
        }
    };
    m.app = server.app;
    state = server.plugins.core.state;
    state.time = moment().add(100, 'years').toDate();
    return m;
};