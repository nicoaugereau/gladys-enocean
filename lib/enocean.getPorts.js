var SerialPort = require('serialport');
var Promise = require('bluebird');

module.exports = function() {

  return listUsbDevices()
    .then(function(ports) {

      return Promise.resolve(ports);
    })
};

function listUsbDevices() {
  return new Promise(function(resolve, reject) {
    SerialPort.list(function(err, ports) {
      if (err) return reject(new Error(err));

      return resolve(ports);
    });
  });
}
