var shared = require('./enocean.shared.js');
var Promise = require('bluebird');
var exclusionMode = false;

module.exports = function removeNode() {
    if(!exclusionMode){
        exclusionMode = true;
        remove();
        return Promise.resolve();
    } else {
        exclusionMode = false;
        shared.enocean.cancelControllerCommand();
        return Promise.resolve();
    }
}

function remove(){
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));
    var enocean = shared.enocean;

    if (enocean.hasOwnProperty('beginControllerCommand')) {
        // using legacy mode - no security
        enocean.beginControllerCommand('RemoveDevice');
    } else {
        // using new security API
        enocean.removeNode();
    }

    enocean.on('node removed', function(nodeid){
        var options = {
            identifier: nodeid,
            service: "enocean"
        }
        sails.log.info(`Enocean module: Node ${nodeid} removed`)
    
         gladys.device.getByIdentifier(options)
            .then(function(data) {
                gladys.device.delete(device = {id: data.id})
                    .then(() => {
                        sails.log.info(`Enocean module: Removing the device of node ${nodeid}`)
                        var removeIndex = shared.nodesInfo.map(function(item) { return item.id; }).indexOf(nodeid);
                        shared.nodesInfo.splice(removeIndex, 1)
                        gladys.socket.emit('nodeRemoved', nodeid);
                    })

            })

        enocean.cancelControllerCommand();
    })
};