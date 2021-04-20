const msgpack = require('@msgpack/msgpack');
const _ = require('lodash');
const Emitter = require('component-emitter');
const PacketType = (exports.PacketType = {
    CONNECT: 0,
    DISCONNECT: 1,
    EVENT: 2,
    ACK: 3,
    CONNECT_ERROR: 4,
});

class Decoder {

    constructor(options) {
        this.options = options;
        this.emitter = new Emitter();
    }

    add (obj) {
        let decoded = msgpack.decode(obj, this.options);
        this.checkPacket(decoded);
        this.emitter.emit('decoded', decoded);
    }

    isDataValid(decoded) {
        switch (decoded.type) {
            case PacketType.CONNECT:
                return decoded.data === undefined || _.isObject(decoded.data);
            case PacketType.DISCONNECT:
                return decoded.data === undefined;
            case PacketType.CONNECT_ERROR:
                return _.isString(decoded.data) || _.isObject(decoded.data);
            default:
                return _.isArray(decoded.data);
        }
    }

    checkPacket = function (decoded) {
        var isTypeValid =
            _.isInteger(decoded.type) && decoded.type >= PacketType.CONNECT && decoded.type <= PacketType.CONNECT_ERROR;
        if (!isTypeValid) {
            throw new Error('invalid packet type');
        }
        if (!_.isString(decoded.nsp)) {
            throw new Error('invalid namespace');
        }
        if (!isDataValid(decoded)) {
            throw new Error('invalid payload');
        }
        var isAckValid = decoded.id === undefined || _.isInteger(decoded.id);
        if (!isAckValid) {
            throw new Error('invalid packet id');
        }
    }

    destroy () {};
}

exports = Decoder;
