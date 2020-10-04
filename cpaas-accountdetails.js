module.exports = function (RED) {
    'use strict';
    const cpaas = require('@avaya/cpaas');
    const utils = require('./Utils/Utils');

    /**
     * Fetches Account details.
     * Updated UI to reflect status.
     * @param {*} config NodeRed config
     */
    function cpaasAccountNode (config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function (msg) {
            const broker = RED.nodes.getNode(config.cpaasBroker);
            utils.setErrorStatus(node, 'Uninitialized');
            const connector = new cpaas.AccountsConnector({
                accountSid: broker.sid,
                authToken: broker.credentials.token,
            });

            if (connector) {
                utils.setOKStatus(node, 'initialized');
                const msg1 = {};
                connector.viewAccount().then((accountDetails) => {
                    const accountActive = accountDetails.status && accountDetails.account_balance > 0;
                    msg1.payload = accountDetails;
                    if (accountActive) {
                        utils.setOKStatus(node, 'Active');
                    } else {
                        utils.setErrorStatus(node, 'InActive');
                    };

                    node.send([msg, msg1]);
                }).catch((error) => {
                    utils.setErrorStatus(node, 'Account Details failed.');
                    node.error('Account Details failed, check token and sid : ' + error);
                });
            } else {
                node.error('Unable to create Account Connector.');
            }
        });
    }
    RED.nodes.registerType('cpaas/Account', cpaasAccountNode);
};


