var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function setup(){
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));

    return Promise.resolve(shared.nodesInfo)
}
