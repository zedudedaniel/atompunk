const _ = require('lodash');

module.exports = function (server) {
    const m = {
        updatePage: function(page) {
            page.addScript('/plugins/paths/js/paths.js');
            page.addCSS('/plugins/paths/css/paths.css');
        }
    };
    m.app = server.app;
    return m;
};
