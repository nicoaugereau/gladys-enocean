var shared = require('./enocean.shared.js');

module.exports = function disconnect(){

     return gladys.param.getValue(shared.gladysUsbPortParam)
        .then((usbPort) => {
            shared.enocean.disconnect(usbPort);
        });
}