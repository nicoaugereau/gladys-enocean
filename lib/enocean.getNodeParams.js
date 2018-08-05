var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function removeNode(options) {
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    shared.setupMode = true
    shared.currentSetupId = options.id
    sails.log.info(`Enocean module : Request all params of node ${options.id}`)
    enocean.requestAllConfigParams(options.id)
    
    return Promise.resolve();
}
