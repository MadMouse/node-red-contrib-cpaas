const libphonenumber = require('libphonenumber-js');

// const phoneNumber = libphonenumber.parsePhoneNumberFromString('+12133734253')

const phoneNumber = libphonenumber.parsePhoneNumberFromString('012133734253')

console.log(phoneNumber.number);
console.log(JSON.stringify(phoneNumber));