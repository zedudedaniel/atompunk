const _ = require('lodash');

module.exports = function (server) {
    const m = {
        updatePage: function(page) {
            const body = page.window.document.getElementsByTagName("body")[0];
            body.insertAdjacentHTML('afterbegin','<div id="poi-info"></div>');
            const head = page.window.document.getElementsByTagName("head")[0];
            head.insertAdjacentHTML('afterbegin','<script src="/js/locations.js"></script>');
        }
    };
    m.app = server.app;
    return m;
};
