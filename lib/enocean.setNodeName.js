var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function setNodeName(options) {
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    enocean.setNodeName(options.nodeId, options.name);
    return Promise.resolve();
}
