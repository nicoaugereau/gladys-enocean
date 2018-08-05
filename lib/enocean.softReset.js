const shared = require('./enocean.shared.js')
const Promise = require('bluebird')
const init = require('./enocean.init.js')

module.exports = function softReset() {
    if (!shared.enocean) return Promise.reject(new Error('Enocean instance not connected'));

    shared.enocean.softReset();
    sails.log.info(`Enocean module : Restarting controller... `)
    init()
    return Promise.resolve();
}
