const _ = require('lodash');

module.exports = function (scenario,state) {
    return {
        getKnowledge: function getKnowledge() {
            var newInfo = _.cloneDeep(scenario);
            newInfo.locations = _.pickBy(newInfo.locations, function (v,k) {
                return state.knownLocations[k];
            });
            newInfo.poiConnections = _.pickBy(newInfo.poiConnections, function (v,k) {
                return state.knownLocations[v.path[0]]&&state.knownLocations[v.path[1]];
            });
            return newInfo;
        }
    }
};