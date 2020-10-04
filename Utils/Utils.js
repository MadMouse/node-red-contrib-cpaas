

/**
 * Update UI with Error Status
 * @param {*} node 
 * @param {*} message 
 */
function setErrorStatus (node, message) {
    node.status({
        shape: 'ring',
        fill: 'red',
        text: message,
    });
}

/**
 * Update UI with warning Status
 * @param {*} node 
 * @param {*} message 
 */
function setWarningStatus (node, message) {
    node.status({
        shape: 'ring',
        fill: 'yellow',
        text: message,
    });
}

/**
 * Update UI with Ok Status
 * @param {*} node 
 * @param {*} message 
 */
function setOkStatus (node, message) {
    node.status({
        shape: 'ring',
        fill: 'green',
        text: message,
    });
}
module.exports.setErrorStatus = setErrorStatus;
module.exports.setWarningStatus = setWarningStatus;
module.exports.setOKStatus = setOkStatus;



// const libphonenumber = require('libphonenumber-js');

// // const phoneNumber = libphonenumber.parsePhoneNumberFromString('+12133734253')

// const phoneNumber = libphonenumber.parsePhoneNumberFromString('012133734253')

// console.log(phoneNumber.number);
// console.log(JSON.stringify(phoneNumber));