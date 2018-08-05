const Promise = require('bluebird')
const getPorts = require('./enocean.getPorts.js')
const setPort = require('./enocean.setPort.js')
const shared = require('./enocean.shared.js')
let controller = {}

module.exports = function init(){

    return getProductIdParam()
        .then((productId) => {
            controller.productId = productId
            return getPorts()
        })
        .then((ports) => {
            return getComName(ports)
        })
        .then(() => {
            return setPort(controller)
        })

}

function getProductIdParam(){
    return gladys.param.getValue(shared.gladysProductIdParam)
        .then((productId) => {
            return Promise.resolve(productId)
        })
        .catch(() => {
            sails.log.error('Enocean module: Please complete the configuration\'s controller in configuration view')
            return Promise.reject()
        })
}

function getComName(ports){
    for(let port of ports){
        if(port.productId == controller.productId){
            controller = port
            return Promise.resolve()
        }
    }
}