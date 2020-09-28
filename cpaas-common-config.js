module.exports = function (RED) {
    'use strict';
    /**
     * CPAAS Broker Node 
     * @param {*} config 
     */
    function cpaasBrokerNode (config) {
        RED.nodes.createNode(this, config);
        const node = this
        node.sid = config.sid;
        node.from = config.from;
        node.name = config.name;
        const credentials = node.credentials;
        if (credentials) {
            node.token = credentials.token;
        }
    }
    RED.nodes.registerType('cpaas-broker', cpaasBrokerNode, {
        credentials: {
            token: 'password',
        },
    });

    /**
     * JDoc Pending
     * @param {*} config 
     */
    function cpaasCallBackBrokerNode (config) {
        RED.nodes.createNode(this, config);
        const node = this
        node.callBackUrl = config.callBackUrl;
        node.callBackMethod = config.callBackMethod;
        node.name = config.name;
    }
    RED.nodes.registerType('cpaas-callback', cpaasCallBackBrokerNode);
};
