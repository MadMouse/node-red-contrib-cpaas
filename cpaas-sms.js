module.exports = function (RED) {
    'use strict';
    const cpaas = require('@avaya/cpaas');

    /**
     * JDoc Pening
     * @param {*} toNumber 
     * @param {*} fromNumber 
     * @param {*} messageText 
     * @param {*} callBackBroker 
     * @param {*} allowMultiple 
     */
    function buildSMSRequest (toNumber, fromNumber, messageText, callBackBroker, allowMultiple) {
        return {
            to: toNumber,
            from: fromNumber,
            body: messageText,
            statusCallback: callBackBroker ? callBackBroker.callBackUrl : null,
            statusCallbackMethod: callBackBroker ? callBackBroker.callBackMethod : null,
            allowMultiple: allowMultiple,
        };
    };

    /**
     * JDoc
     * @param {*} config 
     */
    function cpaasSMSNode (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.number = config.number;
        node.broker = RED.nodes.getNode(config.cpaasBroker);

        node.status({
            shape: 'ring',
            fill: 'red',
            text: 'uninitialized.',
        });

        node.smsClient = new cpaas.SmsConnector({
            accountSid: node.broker.sid,
            authToken: node.broker.credentials.token,
        });
        if (node.smsClient) {
            node.status({
                shape: 'ring',
                fill: 'green',
                text: 'initialized.',
            });
        } else {
            node.error('Unable to create sms connector!');
        }

        node.on('input', function (msg) {
            if (typeof (msg.payload) == 'object') {
                msg.payload = JSON.stringify(msg.payload);
            }

            const callBackBroker = RED.nodes.getNode(config.callbackBroker);
            const toNumber = msg.topic || node.number;
            const smsRequest = buildSMSRequest(toNumber,
                node.broker.from,
                msg.payload,
                callBackBroker,
                false,
            );

            node.status({
                shape: 'ring',
                fill: 'red',
                text: 'Sending',
            });

            node.smsClient.sendSmsMessage(smsRequest)
                .then(function (data) {
                    data.request = smsRequest;
                    msg.payload = data;
                    node.status({
                        shape: 'ring',
                        fill: data.status === 'sent' ? 'green' : 'yellow',
                        text: data.status,
                    });
                    node.send(msg);
                })
                .catch(function (err) {
                    node.status({
                        shape: 'ring',
                        fill: 'red',
                        text: err.message,
                    });
                    node.error(err, msg);
                });
        });
    }
    RED.nodes.registerType('cpaas/SMS', cpaasSMSNode);
}