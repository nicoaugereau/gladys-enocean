var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function setNodeParam(params) {
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    // foreach element in array
    return Promise.map(params, function(param){
        sails.log.info(`Enocean module : Setting value ${param.value} on param ${param.index} of node ${param.node_id}`)
        enocean.setConfigParam(param.node_id, param.index, param.value);
    });
 
    return Promise.resolve();
};