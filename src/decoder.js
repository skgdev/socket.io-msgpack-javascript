const msgpack = require('@msgpack/msgpack');
const Emitter = require('component-emitter');
const _isInteger = require('lodash/isInteger');
const _isString = require('lodash/isString');
const PacketType = require('./packetType');
const { isDataValid } = require('./helpers');

const buildDecoder = (options = {}) => {
    return class Decoder extends Emitter {
        constructor() {
            super();
            this.options = options;
        }

        add(obj) {
            let decoded = msgpack.decode(obj, this.options);
            this.checkPacket(decoded);
            this.emit('decoded', decoded);
        }

        checkPacket(decoded) {
            const isTypeValid =
                _isInteger(decoded.type) &&
                decoded.type >= PacketType.CONNECT &&
                decoded.type <= PacketType.CONNECT_ERROR;
            if (!isTypeValid) {
                throw new Error('invalid packet type');
            }
            if (!_isString(decoded.nsp)) {
                throw new Error('invalid namespace');
            }
            if (!isDataValid(decoded)) {
                throw new Error('invalid payload');
            }
            const isAckValid = decoded.id === undefined || _isInteger(decoded.id);
            if (!isAckValid) {
                throw new Error('invalid packet id');
            }
        }

        destroy() {}
    };
};

module.exports = buildDecoder;
