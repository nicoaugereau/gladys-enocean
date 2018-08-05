
module.exports = function (sails) {

    var init = require('./lib/enocean.init.js');
    var disconnect = require('./lib/enocean.disconnect.js');
    var exec = require('./lib/enocean.exec.js');
    var setup = require('./lib/enocean.setup.js');
    var enoceanInstance = require('./lib/enocean.shared.js').enocean;
    var EnoceanController = require('./controller/EnoceanController.js');

    gladys.on('ready', function(){
        init();
    });

    return {
        init,
        disconnect,
        exec,
        setup,
        enoceanInstance,
        routes: {
            before: {
                'post /enocean/addnode': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'delete /enocean/removenode': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /enocean/getnodeparams/:id': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'patch /enocean/setnodename': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'post /enocean/healnetwork': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'patch /enocean/setnodeparam': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /enocean/softreset': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /enocean/setup': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'get /enocean/getports': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next),
                'patch /enocean/setport': (req, res, next) => sails.hooks.policies.middleware.checktoken(req, res, next)
            },
            after: {
                'post /enocean/addnode': EnoceanController.add,
                'delete /enocean/removenode': EnoceanController.remove,
                'get /enocean/getnodeparams/:id': EnoceanController.getParams,
                'patch /enocean/setnodename': EnoceanController.setName,
                'post /enocean/healnetwork': EnoceanController.heal,
                'patch /enocean/setnodeparam': EnoceanController.setParam,
                'get /enocean/softreset': EnoceanController.reset,
                'get /enocean/setup': EnoceanController.setup,
                'get /enocean/getports': EnoceanController.getPorts,
                'patch /enocean/setport': EnoceanController.setPort,
            }
        }
    };
};
