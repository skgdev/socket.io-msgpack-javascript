const PacketType = require('./packetType');
const _isObject = require('lodash/isObject');
const _isString = require('lodash/isString');

function isDataValid(decoded) {
    switch (decoded.type) {
        case PacketType.CONNECT:
            return decoded.data === undefined || _isObject(decoded.data);
        case PacketType.DISCONNECT:
            return decoded.data === undefined;
        case PacketType.CONNECT_ERROR:
            return _isString(decoded.data) || _isObject(decoded.data);
        default:
            return Array.isArray(decoded.data);
    }
}

module.exports = {
    isDataValid,
};
