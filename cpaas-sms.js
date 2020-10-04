module.exports = function (RED) {
    'use strict';
    const cpaas = require('@avaya/cpaas');
    const utils = require('./Utils/Utils');
    /**
     * Builds SMS send request JSON Object
     * @param {String} toNumber          Number receiving the sms
     * @param {string} fromNumber        Number sending SMS (must be CPAAS number) (E.164 format)
     * @param {string} messageText       SMS Message text
     * @param {cpaasCallBackBrokerNode} callBackBroker    Call back URL for receiving status updates
     * @param {boolean} allowMultiple     Undocumented feature
     * @return {JsonObject} Json Object containing SMS send data.
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
     * Build SMS Connector
     * @param {*} node Current Node.
     * @param {*} broker Current  broker.
     * @return {SmsConnector} SmsConnector
     */
    function initalizeSmsConnector (node, broker) {
        utils.setErrorStatus(node, 'Uninitialized');

        if (broker && broker.sid && broker.credentials.token) {
            const connector = new cpaas.SmsConnector({
                accountSid: broker.sid,
                authToken: broker.credentials.token,
            });
            if (connector) {
                utils.setOKStatus(node, 'initialized');
            }
            return connector;
        }
        node.error('Unable to create sms connector!');
        return null;
    }

    /**
     * Initializes the CPAAS Library and sends the SMS.
     * Updated UI to reflect status.
     * @param {*} config NodeRed config
     */
    function cpaasSMSNode (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function (msg) {
            const node = this;
            if (typeof (msg.payload) == 'object') {
                msg.payload = JSON.stringify(msg.payload);
            }
            node.number = config.number;
            const broker = RED.nodes.getNode(config.cpaasBroker);
            const callBackBroker = RED.nodes.getNode(config.callbackBroker);
            const toNumber = msg.topic || node.number;
            const smsRequest = buildSMSRequest(toNumber,
                broker.from,
                msg.payload,
                callBackBroker,
                false,
            );

            const smsConnector = initalizeSmsConnector(node, broker);
            if (smsConnector) {
                utils.setErrorStatus(node, 'Sending');
                smsConnector.sendSmsMessage(smsRequest)
                    .then(function (data) {
                        data.request = smsRequest;
                        msg.payload = data;
                        if (data.status === 'sent') {
                            utils.setOKStatus(node, data.status);
                        } else {
                            utils.setWarningStatus(node, data.status);
                        }
                        node.send(msg);
                    })
                    .catch(function (err) {
                        utils.setErrorStatus(node, err.message);
                        node.error(err, msg);
                    });
            }
        });
    }
    RED.nodes.registerType('cpaas/SMS', cpaasSMSNode);
};
