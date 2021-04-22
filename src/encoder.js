const msgpack = require('@msgpack/msgpack');

const buildEncoder = (options = {}) => {
    return class Encoder {
        constructor() {
            this.options = options;
        }

        encode(packet) {
            const encoded = msgpack.encode(packet, this.options);
            const buffer = Buffer.from(encoded);

            return [buffer];
        }
    };
};

module.exports = buildEncoder;
