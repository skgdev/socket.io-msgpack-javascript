const msgpack = require('@msgpack/msgpack');

const buildEncoder = (options = {}) => {
    return class Encoder {
        constructor() {
            this.options = options;
        }

        encode(packet) {
            return [msgpack.encode(packet, this.options)];
        }
    };
};

module.exports = buildEncoder;
