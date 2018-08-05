var shared = require('./enocean.shared.js');
var Promise = require('bluebird');

module.exports = function exec(options){
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));

    // separate identifier
    var arr = options.deviceType.deviceTypeIdentifier.split(shared.separator);

    sails.log.info(`Enocean Module : Exec : node_id = ${arr[0]}, comclass=${arr[1]}, value = ${options.state.value}`);
    shared.enocean.setValue({node_id: parseInt(arr[0]), class_id: parseInt(arr[1]), instance:1, index:0}, options.state.value);

    // We return true because Enocean has a State feedback. 
    // So device Exec should not create deviceState
    return Promise.resolve(true);
};
