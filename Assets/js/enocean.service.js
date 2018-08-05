(function () {
    'use strict';

    angular
        .module('gladys')
        .factory('enoceanService', EnoceanService);

    EnoceanService.$inject = ['$http', 'Notification', '$translate'];

    function EnoceanService($http, Notification, $translate) {
        
        var service = {
            addNode: addNode,
            removeNode: removeNode,
            getNodeParams: getNodeParams,
            setNodeName: setNodeName,
            healNetwork: healNetwork,
            setNodeParam: setNodeParam,
            softReset: softReset,
            setup: setup,
            getPorts: getPorts,
            setPort: setPort,
            successNotificationTranslated: successNotificationTranslated,
            errorNotificationTranslated: errorNotificationTranslated
        };

        return service;
        
        function addNode() {
            return $http({method: 'POST', url: '/enocean/addnode' });
        }

        function removeNode() {
            return $http({method: 'DELETE', url: '/enocean/removenode'});
        }

        function getNodeParams(id) {
            return $http({method: 'GET', url: '/enocean/getnodeparams/' + id});
        }

        function setNodeName(options) {
            return $http({method: 'PATCH', url: '/enocean/setnodename/', data: options});
        }

        function healNetwork() {
            return $http({method: 'POST', url: '/enocean/healnetwork' });
        }

        function setNodeParam(options) {
            return $http({method: 'PATCH', url: '/enocean/setnodeparam/', data: options});
        }

        function softReset() {
            return $http({method: 'GET', url: '/enocean/softreset/'});
        }

        function setup() {
            return $http({method: 'GET', url: '/enocean/setup/'});
        }

        function getPorts() {
            return $http({method: 'GET', url: '/enocean/getports/'});
        }

        function setPort(options) {
            return $http({method: 'PATCH', url: '/enocean/setport/', data: options});
        }

        function successNotificationTranslated(key, complement){
            return $translate(key)
                .then(function (text) {
                    if(complement) text += complement;
                    Notification.success(text); 
                });
        }
        
        function errorNotificationTranslated(key, complement){
            return $translate(key)
                .then(function (text) {
                    if(complement) text += complement;
                    Notification.error(text); 
                });
        }
    }
})();