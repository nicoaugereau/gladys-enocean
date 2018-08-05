var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function addNode() {
    if(!shared.inclusionMode){
        shared.inclusionMode = true;
        return add();
    } else {
        shared.inclusionMode = false;
        shared.enocean.cancelControllerCommand();
        return Promise.resolve();
    }
}

function add(){
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    if (enocean.hasOwnProperty('beginControllerCommand')) {
        // using legacy mode - no security
        enocean.beginControllerCommand('AddDevice', true);
    } else {
        // using new security API
        // set this to 'true' for secure devices eg. door locks
        enocean.addNode(false);
    }
    
    return Promise.resolve();
}