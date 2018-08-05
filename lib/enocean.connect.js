var shared = require('./enocean.shared.js');
var Enocean = require('node-enocean')({sensorFilePath : sails.config.appPath + '/' +shared.sensorsFile});
const sep = shared.separator
var enocean = new Enocean(shared.params);
shared.enocean = enocean;

var nodes = [];
var infosNodes = [];
var nodeParams = {};

module.exports = function connect() {

    infosNodes = [];

    return gladys.param.getValue(shared.gladysUsbPortParam)
        .then((usbPort) => {

            enocean.on('node added', function(nodeid) {
                nodes[nodeid] = {
                    manufacturer: '',
                    manufacturerid: '',
                    product: '',
                    producttype: '',
                    productid: '',
                    type: '',
                    name: '',
                    loc: '',
                    classes: {},
                    ready: false,
                };
            });
        
            enocean.on('node ready', function(nodeid, nodeinfo) {

                if(!shared.setupMode){
                    getNodeInfos(nodeid, nodeinfo)
                }else{
                    shared.setupMode = false;
                    gladys.socket.emit('nodeParams', nodeParams[shared.currentSetupId]);
                    nodeParams = {};
                }

                if(shared.inclusionMode) gladys.socket.emit('newNodes', shared.nodesInfo);

            });

            enocean.on('value added', function(nodeid, comclass, value) {
                if (!nodes[nodeid]['classes'][comclass])
                    nodes[nodeid]['classes'][comclass] = {};
                nodes[nodeid]['classes'][comclass][value.index] = value;
        
                if(value.genre != "system" && value.genre != "config"  && value.value != null){
                    var state = {
                        value: value.value
                    };
            
                    gladys.deviceState.createByDeviceTypeIdentifier(nodeid + shared.separator + comclass + shared.separator +  value.index, 'enocean', state)
                        .then(() => {sails.log.info(`Enocean module: State of node ${nodeid} created`)})
                        .catch((err) => sails.log.warn(`Enocean module: Fail to save deviceState : ${err}`));
                }
            });

            enocean.on('value changed', function(nodeid, comclass, value) {

                if(shared.setupMode){
                    nodeParams[nodeid] = nodeParams[nodeid] || [];
                    nodeParams[nodeid].push(value)
                }else{
                    if(value.genre != "system" && value.genre != "config" && value.value != null){
                        var state = {
                            value: value.value
                        };
                
                        gladys.deviceState.createByDeviceTypeIdentifier(nodeid + shared.separator + comclass + shared.separator +  value.index, 'enocean', state)
                            .then(() => {sails.log.info(`Enocean module: State of node ${nodeid} commclass ${comclass} created`)})
                            .catch((err) => sails.log.warn(`Enocean module: Fail to save deviceState : ${err}`));
                    }
                }        
                
            });

            enocean.on('node event', function(nodeid, data) {
                sails.log.info(`Enocean module : Node event : ${nodeid} ${data}`);
            });

            enocean.on('scene event', function(nodeid, sceneid) {
                sails.log.info(`Enocean module : Scene event : ${nodeid} ${sceneid}`);
            });

            enocean.on('scan complete', function(){
                shared.nodesInfo = infosNodes
            })

            enocean.connect(usbPort);
        });
}

function getNodeInfos(nodeid, nodeinfo){

    var newNode = {
        info_node: {
            node_id: `${nodeid}`,
            manufacturer: `${nodeinfo.manufacturer}`,
            product: `${nodeinfo.product}`,
            name: `${nodeinfo.name}`,
            type: `${nodeinfo.type}`,
        },
    }

    if(!nodeinfo.name) nodeinfo.name = nodeinfo.type;

    var newDevice = {
        device: {
            name: `${nodeinfo.name}`,
            protocol: 'enocean',
            service: 'enocean',
            identifier: nodeid
        },
        types: []
    };

    for (comclass in nodes[nodeid]['classes']) {
        switch (comclass) {
            case 0x25: // COMMAND_CLASS_SWITCH_BINARY
            case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
                enocean.enablePoll(nodeid, comclass);
                break;
        }

        var values = nodes[nodeid]['classes'][comclass];

        for (idx in values) {
            var type = values[idx].type;
            var min = values[idx].min;
            var max = values[idx].max;
            
            if (type == 'bool') {
                type = 'binary';
                min = 0;
                max = 1;
            }

            if(values[idx].genre != "system" && values[idx].genre != "config"){
                newDevice.types.push({
                    name: values[idx].label,
                    type: type,
                    identifier: nodeid + shared.separator + comclass + shared.separator + values[idx].index,
                    sensor: values[idx].read_only,
                    unit: values[idx].units,
                    min: min,
                    max: max,
                    display: false
                });
            }
        }
    }

    infosNodes.push(newNode)

    return gladys.device.create(newDevice)
        .then(() => {sails.log.info(`Enocean module : Device of node ${newDevice.device.identifier} created`)})
        .catch((err) => sails.log.error(`Enocean module : Error while creating device of node ${newDevice.device.identifier} : ${err}`));
}