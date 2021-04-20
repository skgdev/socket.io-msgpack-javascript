const PacketType = require('./packetType');
const _ = require('lodash');

function isDataValid(decoded) {
    switch (decoded.type) {
        case PacketType.CONNECT:
            return decoded.data === undefined || _.isObject(decoded.data);
        case PacketType.DISCONNECT:
            return decoded.data === undefined;
        case PacketType.CONNECT_ERROR:
            return _.isString(decoded.data) || _.isObject(decoded.data);
        default:
            return Array.isArray(decoded.data);
    }
}

module.exports = {
    isDataValid,
};
