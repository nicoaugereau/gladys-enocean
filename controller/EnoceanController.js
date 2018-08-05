addNode = require('../lib/enocean.addNode.js');
removeNode = require('../lib/enocean.removeNode.js');
getNodeParams = require('../lib/enocean.getNodeParams.js');
setNodeName = require('../lib/enocean.setNodeName.js');
healNetwork = require('../lib/enocean.healNetwork.js');
setNodeParam = require('../lib/enocean.setNodeParam.js');
softReset = require('../lib/enocean.softReset.js');
setupNodes = require('../lib/enocean.setup.js');
getPorts = require('../lib/enocean.getPorts.js');
setPort = require('../lib/enocean.setPort.js');

module.exports = {

  add: function(req, res, next){
    addNode()
      .then((result) => res.json(result))
  },

  remove: function(req, res, next){
    removeNode()
      .then((result) => res.json(result))
  },

  getParams: function(req, res, next){
    getNodeParams({id: req.params.id})
      .then((result) => res.json(result))
  },

  setName: function(req, res, next){
    setNodeName(req.body)
      .then((result) => res.json(result))
  },

  heal: function(req, res, next){
    healNetwork()
      .then((result) => res.json(result))
  },

  setParam: function(req, res, next){
    setNodeParam(req.body)
      .then((result) => res.json(result))
  },

  reset: function(req, res, next){
    softReset()
      .then((result) => res.json(result))
  },

  setup: function(req, res, next){
    setupNodes()
      .then((result) => res.json(result))
  },

  getPorts: function(req, res, next){
    getPorts()
      .then((result) => res.json(result))
  },

  setPort: function(req, res, next){
    setPort(req.body)
      .then((result) => res.json(result))
  },

}