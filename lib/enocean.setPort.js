const Promise = require('bluebird');
const connect = require('./enocean.connect.js')
const shared = require('./enocean.shared.js');
let enocean = shared.enocean;

module.exports = function(options) {

    //First get the id of enocean module 
    return getEnoceanId()
        .then((id) => {
            options.enoceanId = id
            //Set the product id param
            sails.log.info('Enocean module: Setting the product id param')
            return setProductIdParam(options)
        })
        .then(() => {
            //And set the com name param
            sails.log.info('Enocean module: Setting the com name param')
            return setComParam(options)
        })
        .then(() => {
            //Finaly return success response and run connection
            sails.log.info('Enocean module: Running connection')
            if(enocean != null)enocean.removeAllListeners()
            connect()
            return Promise.resolve()
        })
};

function getEnoceanId(){
    return gladys.module.get()
        .then(modules => {
            for(let module of modules){
                if(module.slug == 'enocean'){
                    return Promise.resolve(module.id)
                }
            }
        })
}

function setProductIdParam(options){

    var param = {
        name: shared.gladysProductIdParam,
        value: options.productId,
        type: 'hidden',
        module: options.enoceanId,
        description : 'This param is the product\'s id of enocean controller. He Is used for auto-detection of the com port'
   }
   
   return gladys.param.setValue(param)
        .then(function(){
            return Promise.resolve();
        })
        .catch(e => {
            sails.log.error(`Enocean module: Product id param not seted. Error ${e}`)
            return Promise.reject()
        })
}

function setComParam(options){
    
    var param = {
        name: shared.gladysUsbPortParam,
        value: options.comName,
        type: 'visible',
        module: options.enoceanId,
        description : 'This param is the com port of enocean controller.'
   }

   return gladys.param.setValue(param)
        .then(function(){
            return Promise.resolve();
        })
        .catch(e => {
            sails.log.error(`Enocean module: Com name param not seted. Error ${e}`)
            return Promise.reject()
        })

};