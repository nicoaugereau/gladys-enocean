 (function () {
    'use strict';

    angular
        .module('gladys')
        .controller('EnoceanCtrl', EnoceanCtrl);

    EnoceanCtrl.$inject = ['enoceanService', '$scope'];

    function EnoceanCtrl(enoceanService, $scope) {
        /* jshint validthis: true */
        var vm = this
        vm.addNode = addNode
        vm.healNetwork = healNetwork
        vm.setNodeName = setNodeName
        vm.removeNode = removeNode
        vm.setNodeParam = setNodeParam
        vm.getNodeParams = getNodeParams
        vm.softReset = softReset
        vm.getPorts = getPorts
        vm.setPort = setPort

        vm.nodes = []
        vm.selectedNodeParams = []
        vm.ports = []
        vm.selectedPort = null
        vm.nodesReady = false
        vm.paramsReady = false
        vm.nodesIsEmpty = false
        vm.timeLeft = 30

        var interval = null
        var timerCountDown
        
        activate()

        function activate() {

            io.socket.on('nodeParams', function (params) {                
                $scope.$apply(function(){
                    vm.selectedNodeParams = params
                    vm.paramsReady = true
                    clearInterval(interval)
                });  
            });

            io.socket.on('newNodes', function (node) {                
                $scope.$apply(function(){
                    vm.nodes.push(node)
                    $(".enocean-inclusionModal").modal("hide")
                    enoceanService.addNode()
                    clearTimeout(timerCountDown)
                });  
            });

            io.socket.on('nodeRemoved', function (node) {                
                $scope.$apply(function(){
                    var removeIndex = vm.nodes.map(function(item) { return item.id; }).indexOf(node);
                    vm.nodes.splice(removeIndex, 1)
                    $(".enocean-exclusionModal").modal("hide")
                    enoceanService.removeNode()
                    clearTimeout(timerCountDown)
                });  
            });

            enoceanService.setup()
                .then(function(result){
                    if(result.status != 200) enoceanService.errorNotificationTranslated('ERROR')
                    vm.nodes = result.data
                    if(vm.nodes.length == 0) {
                        vm.nodesIsEmpty = true
                    }else {
                        vm.nodesIsEmpty = false
                        vm.nodesReady = true
                        clearInterval(interval)
                    }
                })
            
        }
        
        function addNode(){
            return enoceanService.addNode()
                .then(function(result){
                    if(result.status != 200){
                        enoceanService.errorNotificationTranslated('ERROR')
                        $(".enocean-inclusionModal").modal("hide")
                    }else{
                        vm.timeLeft = 30
                        countdown($(".enocean-inclusionModal"), enoceanService.addNode);
                    }
                })
        }

        function removeNode(){
            return enoceanService.removeNode()
                .then(function(result){
                    if(result.status == 200){
                        vm.timeLeft = 30
                        countdown($(".enocean-exclusionModal"), enoceanService.removeNode);
                    }else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function healNetwork(){
            return enoceanService.healNetwork()
                .then(function(result){
                    if(result.status == 200){enoceanService.successNotificationTranslated('HEALING_NETWORK')}
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function setNodeName(nodeId, name){
            return enoceanService.setNodeName({nodeId: nodeId, name: name})
                .then(function(result){
                    if(result.status == 200){enoceanService.successNotificationTranslated('NODE_NAME_UPDATED');}
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function setNodeParam(){
            return enoceanService.setNodeParam(vm.selectedNodeParams)
                .then(function(result){
                    if(result.status == 200){enoceanService.successNotificationTranslated('SETTINGS_APPLIED');}
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }
        
        function getNodeParams(id){
            vm.selectedNodeParams = []
            vm.paramsReady = false
            return enoceanService.getNodeParams(id)
                .then(function(result){
                    if(result.status == 200){
                        timer(vm.selectedNodeParams)
                            .then(function(res){
                                if(res == true) {
                                    $(".enocean-configModal").modal("hide")
                                    enoceanService.errorNotificationTranslated('ERROR')
                                }
                            })
                    }else{
                        $(".enocean-configModal").modal("hide")
                        enoceanService.errorNotificationTranslated('ERROR')
                    }
                })
        }

        function softReset(){
            return enoceanService.softReset()
                .then(function(result){
                    if(result.status == 200){enoceanService.successNotificationTranslated('RESTARTING');}
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function getPorts(){
            return enoceanService.getPorts()
                .then(function(result){
                    if(result.status == 200){
                        vm.ports = result.data
                    }
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function setPort(){
            return enoceanService.setPort(vm.selectedPort)
                .then(function(result){
                    if(result.status == 200){enoceanService.successNotificationTranslated('SETTINGS_APPLIED');}
                    else{enoceanService.errorNotificationTranslated('ERROR')}
                })
        }

        function timer(options){
            return new Promise(function(resolve, reject) {
                interval = setInterval((function() {
                   if(options.length == 0 || options == null) resolve(true)
                   resolve(false)
               }), 30000);
            })
        }

        function countdown(modal, fun) {
            timerCountDown = setInterval((function() {
                if (vm.timeLeft == 0) {
                    clearTimeout(timerCountDown);
                    modal.modal("hide");
                    fun()
                } else {
                    $scope.$apply(function(){
                        vm.timeLeft--;
                    });  
                }
            }), 1000);
        }
    }
})();