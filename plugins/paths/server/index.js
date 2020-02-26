const _ = require('lodash');

module.exports = function (server) {
    const m = {
        updatePage: function(page) {
            const head = page.window.document.getElementsByTagName("head")[0];
            head.insertAdjacentHTML('afterbegin','<script src="/js/paths.js"></script>');
        }
    };
    m.app = server.app;
    return m;
};
