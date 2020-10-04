module.exports.registerNumberList = function (RED) {
    'use strict';
    const cpaas = require('@avaya/cpaas');

    const node = this;
    /**
     * Shows info on all incoming numbers associated with some account
     */
    RED.httpAdmin.get('/cpaas-numbers/:sid/:token/:pageNumber', RED.auth.needsPermission('read'), function (req, res) {
        const incomingPhoneNumbersConnector = new cpaas.IncomingPhoneNumbersConnector({
            accountSid: req.params.sid,
            authToken: req.params.token,
        });

        if (incomingPhoneNumbersConnector) {
            incomingPhoneNumbersConnector.listIncomingNumbers({
                page: req.params.pageNumber,
                pageSize: 200,
            }).then((data) => {
                res.json(data.incoming_phone_numbers);
            }).catch((error) => console.log(alert(error.message)));
        }
    });
};

