var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function healNetwork() {
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    enocean.healNetwork();
    sails.log.info(`Enocean module : Network healing...`)
    return Promise.resolve();
}
